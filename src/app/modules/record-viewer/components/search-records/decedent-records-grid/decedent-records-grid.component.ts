import {Component, OnInit, ViewChild, ElementRef, Inject, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {DecedentGridDTO} from "../../../../../model/decedent.grid.dto";
import {DecedentService} from "../../../services/decedent.service";
import {Router} from "@angular/router";
import {mergeMap, forkJoin, map} from "rxjs";
import {DatePipe} from "@angular/common";
import {BundleHelperService, FhirHelperService} from "../../../../fhir-util";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";
import {MatTableDataSource} from "@angular/material/table";
import {AppConfiguration} from "../../../../../providers/app-configuration";
import {TrackingNumberType} from "../../../../fhir-mdi-library";
import {FHIRProfileConstants} from "../../../../../providers/fhir-profile-constants";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {
  FormGroup,
  FormBuilder,
  FormControl
} from "@angular/forms";

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
  selector: 'record-viewer-decedent-records-grid',
  templateUrl: './decedent-records-grid.component.html',
  styleUrls: ['../../../record-viewer-styles.scss', '../search-records.component.scss'],
  standalone: false
})
export class DecedentRecordsGridComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource<any>();
  //TODO uncomment when we know how to use gender/sex fields per the CDC guidelines. Note that gender should come from Sex at Death
  displayedColumns: string[] = ['lastName', 'gender', 'tod', 'mannerOfDeath', 'caseNumber'];
  //displayedColumns: string[] = ['lastName', 'tod', 'mannerOfDeath', 'caseNumber'];
  decedentGridDtoList: DecedentGridDTO[];
  isLoading = true;
  datePipe: DatePipe;

  pageSize = 10;
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly searchFilterForm = new FormGroup({
    gender: new FormControl<Gender | null>(null),
    deathDate: this.fb.group({
      start: [null],
      end: [null]})
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

   mapToDto(resource: any): DecedentGridDTO {
    let decedentDTO = new DecedentGridDTO();
    decedentDTO.decedentId = resource?.id;
    decedentDTO.firstName = resource?.name?.[0]?.given?.[0];
    decedentDTO.lastName = resource?.name?.[0]?.family;
    decedentDTO.gender = resource?.gender;
    decedentDTO.system = resource?.identifier?.[0]?.system || null;
    decedentDTO.age = this.getAgeFromDob(new Date(resource?.birthDate));
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
    this.currentPage = 0;
    this.paginator.pageIndex = this.currentPage;
    this.getDecedentRecords(this.currentPage, this.pageSize, searchParams)
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
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

  onCaseSelected(row: any) {
    this.router.navigate([`${this.appConfig.modules['recordViewer'].route}/mdi/`, row.decedentId]);
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

  onPageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    let searchParams: SearchParams = this.searchParams;
    this.getDecedentRecords(this.currentPage, this.pageSize, searchParams);
  }

}
