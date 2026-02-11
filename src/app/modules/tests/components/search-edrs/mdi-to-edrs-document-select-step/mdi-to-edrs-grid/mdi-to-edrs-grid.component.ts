import {AfterViewInit, Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {DecedentGridDTO} from "../../../../../../model/decedent.grid.dto";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
import {DecedentService} from "../../../../../record-viewer/services/decedent.service";
import {UtilsService} from "../../../../../../service/utils.service";
import {forkJoin, map, mergeMap, switchMap} from "rxjs";
import {SearchEdrsService} from "../../../../services/search-edrs.service";
import {DecedentSimpleInfo} from "../../../../../../model/decedent-simple-info";
import {FhirHelperService, PatientNameReturn} from "../../../../../fhir-util/services/fhir-helper.service";
import {DatePipe} from "@angular/common";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {TrackingNumberType} from "../../../../../fhir-mdi-library";
import {ModuleHeaderConfig} from "../../../../../../providers/module-header-config";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {BundleHelperService} from "../../../../../fhir-util";

export interface DeathDateRange{
  start?: string;
  end?: string;
}

export interface SearchParams{
  deathDate?: DeathDateRange,
  gender?: Gender
}

export type Gender = 'male' | 'female' | 'unknown';


@Component({
    selector: 'app-mdi-to-edrs-grid',
    templateUrl: './mdi-to-edrs-grid.component.html',
    styleUrls: ['./mdi-to-edrs-grid.component.scss'],
    standalone: false
})
// For now this class component is almost exactly the same as the one we use for the decedent-records-grid.
// However, the functionality will be different and we are going to change the code at some point in the near future.
export class MdiToEdrsGridComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['lastName', 'gender', 'tod', 'mannerOfDeath', 'caseNumber'];
  decedentGridDtoList: DecedentGridDTO[];
  isLoading = true;
  datePipe: DatePipe;
  selectedCase: any;
  decedentInfo: DecedentSimpleInfo;

  pageSize = 5;
  currentPage = 0;

  readonly genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'unknown', label: 'Unknown' }
  ] as const;

// Or simpler array if you want same value/label
  readonly genders: Gender[] = ['male', 'female', 'unknown'];


  @Output() serverErrorEventEmitter = new EventEmitter();
  totalDataSize: number = 0;
  readonly pageSizes = [5, 10, 20];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly searchFilterForm = new FormGroup({
    gender: new FormControl<Gender | null>(null),
    deathDate: this.fb.group({
      start: [null],
      end: [null]})
  });

  constructor(
    @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private decedentService: DecedentService,
    private router: Router,
    private utilsService: UtilsService,
    private searchEdrsService: SearchEdrsService,
    private fhirHelperService: FhirHelperService,
    private bundleHelperService: BundleHelperService,
  ) {
  }

  mapToDto(entry: any): DecedentGridDTO {
    let decedentDTO = new DecedentGridDTO();
    decedentDTO.decedentId = entry?.id;
    decedentDTO.firstName = this.fhirHelperService.getOfficialName(entry, PatientNameReturn.firstonly);
    decedentDTO.lastName = this.fhirHelperService.getOfficialName(entry, PatientNameReturn.lastonly);
    decedentDTO.gender = entry?.gender;
    decedentDTO.system = entry.identifier?.[0]?.system || null;
    decedentDTO.age = this.getAgeFromDob(new Date(entry.birthDate));
    decedentDTO.patientResource = entry;
    return decedentDTO;
  }

  private get searchParams(): SearchParams {
    const params: SearchParams = {};

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
      ...(startValue && { start: this.datePipe.transform(startValue, 'yyyy-MM-dd')! }),
      ...(endValue && { end: this.datePipe.transform(endValue, 'yyyy-MM-dd')! })
    };
  }

  onSearch(){
    let searchParams: SearchParams = this.searchParams;
    if(searchParams){
      this.decedentService.setSearchResultsBundleId(null);
    }
    this.getDecedentRecords(1, this.pageSize, searchParams)
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDecedentRecords(pageNumber: number, pageSize: number, searchParms?: SearchParams){
    const loincCauseOfDeath = '69449-7';
    const loincTimeOfDeath = '81956-5';
    const codes = [loincCauseOfDeath, loincTimeOfDeath];

    this.isLoading = true;
    this.decedentService.getDecedentRecords(pageNumber,  pageSize, searchParms).pipe(
      map(data => {
        this.totalDataSize = data.total;
        const result = this.bundleHelperService.mapBundleToEntries(data);
        return result;
      }),
      mergeMap((decedentRecordsList: any[]) =>
        forkJoin(
          decedentRecordsList.map((decedentRecord: any, i) =>
            this.decedentService.getDecedentObservationsByCode(decedentRecord, codes).pipe(
              map((observation: any) => {
                decedentRecord = this.mapToDto(decedentRecord);
                const tod = observation?.entry?.find(entry => entry.resource?.code?.coding[0]?.code == loincTimeOfDeath)?.resource?.valueDateTime;
                decedentRecord.tod = tod;
                const mannerOfDeath =  observation?.entry?.find(entry => entry.resource?.code?.coding?.[0]?.code == loincCauseOfDeath)?.resource?.valueCodeableConcept?.coding?.[0]?.display;
                decedentRecord.mannerOfDeath = mannerOfDeath;
                decedentRecord.index = i + 1;
                return decedentRecord;
              })
            )
          ))
      )
    ).pipe(
      mergeMap((decedentRecordsList: any[]) =>
        forkJoin(
          decedentRecordsList.map((decedentRecord: any, i) =>
            this.decedentService.getComposition(decedentRecord.decedentId).pipe(
              map((searchset: any) => {
                const mdiSystem = this.fhirHelperService.getTrackingNumberSystem(searchset?.entry?.[0]?.resource, TrackingNumberType.Mdi);
                decedentRecord.system = mdiSystem;
                const caseNumber = searchset?.entry?.[0]?.resource?.extension?.[0]?.valueIdentifier?.value;
                decedentRecord.caseNumber = caseNumber;
                return decedentRecord
              })
            )
          ))
      )
    )
      .subscribe({
        next: (data) => {
          this.decedentGridDtoList = data.filter(record => !!record.caseNumber);
          this.dataSource = new MatTableDataSource(this.decedentGridDtoList);
          this.dataSource.sort = this.sort;
          this.setDataSourceFilters();
        },
        error: (e) => {
          this.isLoading = false;
          console.error(e);
          this.serverErrorEventEmitter.emit();
        },
        complete:  () => {
          this.isLoading = false;
        },
      });

  }

  ngOnInit(): void {
    this.decedentService.setSearchResultsBundleId(null);
    this.getDecedentRecords(this.currentPage, this.pageSize);
  }

  onCaseSelected(decedent: any) {
    this.selectedCase = decedent;
    this.decedentInfo = new DecedentSimpleInfo();
    this.decedentInfo.mdiTrackingNumber = decedent.caseNumber;
    this.decedentInfo.dateTimeOfDeath = decedent.tod;
    this.decedentInfo.name = decedent.lastName + ', ' + decedent.firstName ? ', ' + decedent.firstName : '';
    this.decedentInfo.patientResource = decedent.patientResource;
    this.searchEdrsService.setDecedentData(this.decedentInfo);

    this.decedentService.getComposition(decedent.decedentId).pipe(
      switchMap(composition => this.decedentService.getDocumentBundle(composition?.entry?.[0]?.resource?.id))
    ).subscribe({
      next: result => this.searchEdrsService.setDocumentBundle(result),
      error: err => {
        console.error(err);
        this.utilsService.showErrorMessage("Error retrieving document bundle.")
      }
    });
  }


  getAgeFromDob(birthday: any) {
    const ageDifMs = Date.now() - birthday;
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  private setDataSourceFilters() {
    this.datePipe = new DatePipe('en');
    const defaultPredicate = this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data, filter) => {
      const formatted = this.datePipe.transform(data.tod,'MM/dd/yyyy');
      return formatted.indexOf(filter) >= 0 || defaultPredicate(data,filter) ;
    }
  }

  onClearFilters() {
    if(this.searchFilterForm.touched) {
      this.searchFilterForm.reset();
      this.searchFilterForm.markAsPristine();
      this.getDecedentRecords(this.currentPage, this.pageSize);
    }
  }

  onPageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    let searchParams: SearchParams = this.searchParams;
    this.getDecedentRecords(this.currentPage, this.pageSize, searchParams);
  }

}
