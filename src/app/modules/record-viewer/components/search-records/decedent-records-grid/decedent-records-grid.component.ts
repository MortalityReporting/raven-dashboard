import {Component, OnInit, ViewChild, Inject, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {DecedentGridDTO} from "../../../../../model/decedent.grid.dto";
import {DecedentService} from "../../../services/decedent.service";
import {Router} from "@angular/router";
import {mergeMap, forkJoin, map, of, Observable, catchError} from "rxjs";
import {DatePipe} from "@angular/common";
import {BundleHelperService, FhirHelperService, FhirResource} from "../../../../fhir-util";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";
import {MatTableDataSource} from "@angular/material/table";
import {AppConfiguration} from "../../../../../providers/app-configuration";
import {FHIRProfileConstants} from "../../../../../providers/fhir-profile-constants";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {
  FormGroup,
  FormBuilder,
  FormControl
} from "@angular/forms";
import {TrackingNumberType} from "../../../../fhir-mdi-library";
import {PatientNameReturn} from "../../../../fhir-util/services/fhir-helper.service";
import {CombinedPatientObservationsComposition} from "../../../models/combined-patient-observations-composition";
import {DeathDateRange} from "../../../models/death-date-range";
import {CompositionPatientPair} from "../../../models/composition-patient-pair";
import {GridSearchParams} from "../../../models/grid-search-params";



export type Gender = 'male' | 'female' | 'unknown';


@Component({
  selector: 'record-viewer-decedent-records-grid',
  templateUrl: './decedent-records-grid.component.html',
  styleUrls: ['../../../record-viewer-styles.scss', '../search-records.component.scss'],
  standalone: false
})
export class DecedentRecordsGridComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['lastName', 'gender', 'tod', 'mannerOfDeath', 'caseNumber'];
  decedentGridDtoList: DecedentGridDTO[];
  isLoading = true;
  datePipe: DatePipe;

  pageSize = 5;
  currentPage = 0;

  readonly genderOptions = [
    {value: 'male', label: 'Male'},
    {value: 'female', label: 'Female'},
    {value: 'unknown', label: 'Unknown'}
  ] as const;

// Or simpler array if you want same value/label
  readonly genders: Gender[] = ['male', 'female', 'unknown'];

  private extractFirstName(patient: any): string | null {
    if (!patient?.name || patient.name.length === 0) return null;

    const firstNameStr = this.fhirHelperService.getOfficialName(patient, PatientNameReturn.firstonly);
    if(firstNameStr) return firstNameStr;


    // Check for masked data
    const name = patient.name[0];
    const maskedExtension = name?.extension?.find(
      (ext: any) =>
        ext.url === 'http://hl7.org/fhir/StructureDefinition/data-absent-reason' &&
        ext.valueCode === 'masked'
    );

    if (maskedExtension) return 'MASKED';

    return null;
  }

  private extractLastName(patient: any): string | null {
    if (!patient?.name || patient.name.length === 0) return null;

    const lastNameStr = this.fhirHelperService.getOfficialName(patient, PatientNameReturn.lastonly);
    if(lastNameStr) return lastNameStr;

    const name = patient.name[0];

    // Check for masked data
    const maskedExtension = name?.extension?.find(
      (ext: any) =>
        ext.url === 'http://hl7.org/fhir/StructureDefinition/data-absent-reason' &&
        ext.valueCode === 'masked'
    );

    if (maskedExtension) return 'MASKED';

    return name?.family ?? null;
  }

  toGridDTO(
    combined: CombinedPatientObservationsComposition,
    index: number
  ): DecedentGridDTO {
    const dto = new DecedentGridDTO();
    const {composition, patient, todObservation, mannerOfDeathObservation} = combined;

    // Index
    dto.index = index;

    // Patient data
    if (patient) {
      dto.decedentId = patient?.id;
      dto.firstName = this.extractFirstName(patient);
      dto.lastName = this.extractLastName(patient);
      dto.gender = patient?.['gender'] ?? null;
      dto.patientResource = patient;
    }

    // Composition data
    if (composition) {
      dto.system = this.fhirHelperService.getTrackingNumberSystem(composition, TrackingNumberType.Mdi);
      dto.status = composition?.['status'] ?? null;
      dto.caseNumber = composition?.['extension']?.[0]?.valueIdentifier?.value;
    }

    // Time of Death from observation
    dto.tod = todObservation?.['valueDateTime'];

    // Manner of Death from observation
    dto.mannerOfDeath = mannerOfDeathObservation?.['valueCodeableConcept']?.coding?.[0]?.display;

    return dto;
  }

  @Output() serverErrorEventEmitter = new EventEmitter();
  totalDataSize: number = 0;
  readonly pageSizes = [5, 10, 20];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly searchFilterForm = new FormGroup({
    gender: new FormControl<Gender | null>(null),
    deathDate: this.fb.group({
      start: [null],
      end: [null]
    })
  });

  constructor(
    private fb: FormBuilder,
    private decedentService: DecedentService,
    private router: Router,
    private fhirHelperService: FhirHelperService,
    private bundleHelperService: BundleHelperService,
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration,
    @Inject('fhirProfiles') public fhirProfiles: FHIRProfileConstants
  ) {
  }

  private get searchParams(): GridSearchParams {
    const params: GridSearchParams = {};

    // Add gender if selected
    const gender = this.searchFilterForm.controls.gender.value;
    if (gender) {
      params.gender = gender;
    }

    // Add death date range
    const deathDate = this.deathDateRange;
    if (deathDate) {
      params.deathDate = deathDate;
    }

    return params;
  }

  private get deathDateRange(): DeathDateRange | null {
    const startValue = this.searchFilterForm.controls.deathDate.controls.start.value;
    const endValue = this.searchFilterForm.controls.deathDate.controls.end.value;

    if (!startValue && !endValue) {
      return null;
    }

    return {
      ...(startValue && {start: this.datePipe.transform(startValue, 'yyyy-MM-dd')!}),
      ...(endValue && {end: this.datePipe.transform(endValue, 'yyyy-MM-dd')!})
    };
  }

  onSearch() {
    let searchParams: GridSearchParams = this.searchParams;
    if (searchParams) {
      this.decedentService.setSearchResultsBundleId(null);
    }
    this.currentPage = 0;
    this.paginator.pageIndex = this.currentPage;
    this.getDecedentRecords(this.currentPage, this.pageSize, searchParams)
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  private findObservationByCode(
    observations: FhirResource[],
    loincCode: string
  ): FhirResource | null {

    const observation = observations.find(obs => {
      const coding = obs?.['code']?.coding;
      if (!coding || !Array.isArray(coding)) return false;

      return coding.some(c => c.code === loincCode);
    });

    return observation || null;
  }

  private fetchAndCombineObservations(
    pair: CompositionPatientPair
  ): Observable<CombinedPatientObservationsComposition> {

    if (!pair.patient) {
      // Return combined object with nulls if no patient
      return of({
        composition: pair.composition,
        patient: null,
        todObservation: null,
        mannerOfDeathObservation: null
      });
    }

    const loincCauseOfDeath = '69449-7'; // Manner of death
    const loincTimeOfDeath = '81956-5';  // Time of death
    const codes = [loincCauseOfDeath, loincTimeOfDeath];

    return this.decedentService.getDecedentObservationsByCode(pair.patient, codes).pipe(
      map(observationBundle => {
        const observations = this.bundleHelperService.mapBundleToEntries(observationBundle);

        // Extract specific observations
        const todObservation = this.findObservationByCode(observations, loincTimeOfDeath);
        const mannerOfDeathObservation = this.findObservationByCode(observations, loincCauseOfDeath);

        const combined: CombinedPatientObservationsComposition = {
          composition: pair.composition,
          patient: pair.patient,
          todObservation,
          mannerOfDeathObservation
        };

        return combined;
      }),
      catchError(error => {
        console.error(`Error fetching observations for patient ${pair.patient?.id}:`, error);

        // Return combined object with null observations on error
        return of({
          composition: pair.composition,
          patient: pair.patient,
          todObservation: null,
          mannerOfDeathObservation: null
        });
      })
    );
  }

  private createResourceMap(resources: any[]): Map<string, any> {
    const map = new Map<string, any>();

    resources.forEach(resource => {
      if (resource.id) {
        // Store by ID only
        map.set(resource.id, resource);
        // Store by full reference (ResourceType/ID)
        map.set(`${resource.resourceType}/${resource.id}`, resource);
      }
    });

    return map;
  }

  private getPatientFromReference(
    reference: string | undefined,
    patientMap: Map<string, FhirResource>
  ): FhirResource | null {
    if (!reference) return null;

    // Extract ID from reference like "Patient/208897Decedent"
    const parts = reference.split('/');
    if (parts.length < 2) return null;

    const id = parts[1];
    const patient = patientMap.get(id);

    return patient as FhirResource || null;
  }

  getDecedentRecords(pageNumber: number, pageSize: number, searchParams?: GridSearchParams) {
    this.isLoading = true;

    this.decedentService.getDecedentRecords(pageNumber, pageSize, searchParams).pipe(
      // Step 1: Extract and organize resources from initial bundle
      map(bundle => {
        this.totalDataSize = bundle.total;
        const allResources = this.bundleHelperService.mapBundleToEntries(bundle);

        const compositions = allResources.filter(r => r.resourceType === 'Composition');
        const patients = allResources.filter(r => r.resourceType === 'Patient');
        return {compositions, patients};
      }),

      // Step 2: Create composition-patient pairs
      map(({compositions, patients}) => {
        const patientMap = this.createResourceMap(patients);

        const pairs: CompositionPatientPair[] = compositions.map(composition => ({
          composition,
          patient: this.getPatientFromReference(composition.subject?.reference, patientMap)
        }));
        return pairs;
      }),

      // Step 3: Fetch observations for each composition-patient pair
      mergeMap((pairs: CompositionPatientPair[]) => {
        const combinedObservationRequests = pairs.map(pair =>
          this.fetchAndCombineObservations(pair)
        );
        return forkJoin(combinedObservationRequests);
      })
    ).subscribe({
      next: (combinedData: CombinedPatientObservationsComposition[]) => {
        // Convert to DTOs
        this.decedentGridDtoList = combinedData
          .map((combined, index) => this.toGridDTO(combined, index + 1))
          .filter(dto => !!dto.caseNumber);

        console.log(`Final DTOs: ${this.decedentGridDtoList.length}`);

        this.dataSource = new MatTableDataSource(this.decedentGridDtoList);
        this.setDataSourceFilters();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading decedent records:', error);
        this.serverErrorEventEmitter.emit();
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    this.decedentService.setSearchResultsBundleId(null);
    this.getDecedentRecords(this.currentPage, this.pageSize);
  }

  onCaseSelected(row: any) {
    this.router.navigate([`${this.appConfig.modules['recordViewer'].route}/mdi/`, row.decedentId]);
  }

  private setDataSourceFilters() {
    this.datePipe = new DatePipe('en');
    const defaultPredicate = this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data, filter) => {
      const formatted = this.datePipe.transform(data.tod, 'MM/dd/yyyy');
      return formatted.indexOf(filter) >= 0 || defaultPredicate(data, filter);
    }
  }

  onPageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    let searchParams: GridSearchParams = this.searchParams;
    this.getDecedentRecords(this.currentPage, this.pageSize, searchParams);
  }

}
