import {Component, OnInit, ViewChild, ElementRef, Inject, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {DecedentGridDTO} from "../../../../../model/decedent.grid.dto";
import {DecedentService} from "../../../services/decedent.service";
import {ActivatedRoute, Router} from "@angular/router";
import {mergeMap, forkJoin, map} from "rxjs";
import {UtilsService} from "../../../../../service/utils.service";
import {DatePipe} from "@angular/common";
import {BundleHelperService, FhirHelperService} from "../../../../fhir-util";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";
import {MatSelect} from "@angular/material/select";
import {MatTableDataSource} from "@angular/material/table";
import {AppConfiguration} from "../../../../../providers/app-configuration";
import {TrackingNumberType} from "../../../../fhir-mdi-library";
import {FHIRProfileConstants} from "../../../../../providers/fhir-profile-constants";
import {MatPaginator, PageEvent} from "@angular/material/paginator";


@Component({
  selector: 'record-viewer-decedent-records-grid',
  templateUrl: './decedent-records-grid.component.html',
  styleUrls: ['../../../record-viewer-styles.scss', '../search-records.component.scss'],
  standalone: false
})
export class DecedentRecordsGridComponent implements OnInit, AfterViewInit {

  @ViewChild('mannerOfDeathSelect') mannerOfDeathSelect: MatSelect;

  dataSource = new MatTableDataSource<any>();
  //TODO uncomment when we know how to use gender/sex fields per the CDC guidelines. Note that gender should come from Sex at Death
  displayedColumns: string[] = ['lastName', 'gender', 'tod', 'mannerOfDeath', 'caseNumber'];
  //displayedColumns: string[] = ['lastName', 'tod', 'mannerOfDeath', 'caseNumber'];
  decedentGridDtoList: DecedentGridDTO[];
  isLoading = true;
  mannerOfDeathList: string [] = [];
  pipe: DatePipe;
  pageSize = 10;
  currentPage = 0;
  curre
  @Output() serverErrorEventEmitter = new EventEmitter();
  urlPrevious = '';
  urlNext='';
  totalDataSize: number = 0;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  readonly pageSizes = [5, 10, 20];


  @ViewChild('input') input: ElementRef;


  constructor(
    private route: ActivatedRoute,
    private decedentService: DecedentService,
    private router: Router,
    private utilsService: UtilsService,
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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // getNext(fullUrl: string){
  //   this.getDecedentRecords(fullUrl);
  // }
  //  getPrevious(fullUrl: string){
  //   this.getDecedentRecords(fullUrl);
  //  }

  getDecedentRecords(pageNumber: number, pageSize: number){
    const loincCauseOfDeath = '69449-7';
    const loincTimeOfDeath = '81956-5';
    const codes = [loincCauseOfDeath, loincTimeOfDeath];
    this.isLoading = true;
    // NOTE: Decedents are FHIR Patient resources.
    // this.urlPrevious = '';
    // this.urlNext = '';
   // const pageSize = this.paginator?.pageSize ? this.paginator.pageSize : this.pageSize;
    this.decedentService.getDecedentRecords(pageNumber,  pageSize).pipe(
      map(data => {
        console.log(data);
        this.totalDataSize = data.total;
        this.urlPrevious = data.link.find(link => link.relation == 'previous')?.url;
        this.urlNext = data.link.find(link => link.relation == 'next')?.url;
        const result = this.bundleHelperService.mapBundleToEntries(data);
        return result;
      }),
      map(decedentRecords =>
        decedentRecords
          .filter(record =>
            record?.meta?.profile?.indexOf(this.fhirProfiles.DCR.Dcr_Structure_Definition) == -1
          )
      ),
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
          this.mannerOfDeathList = this.getMannerOfDeathList(this.decedentGridDtoList);
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

   //
   // getDecedentRecords(fullUrl?: string){
   //   const loincCauseOfDeath = '69449-7';
   //   const loincTimeOfDeath = '81956-5';
   //   const codes = [loincCauseOfDeath, loincTimeOfDeath];
   //   this.isLoading = true;
   //   // NOTE: Decedents are FHIR Patient resources.
   //   this.urlPrevious = '';
   //   this.urlNext = '';
   //   const pageSize = this.paginator?.pageSize ? this.paginator.pageSize : this.pageSize;
   //   this.decedentService.getDecedentRecords(pageSize,  fullUrl).pipe(
   //     map(data => {
   //       console.log(data);
   //       this.totalDataSize = data.total;
   //       this.urlPrevious = data.link.find(link => link.relation == 'previous')?.url;
   //       this.urlNext = data.link.find(link => link.relation == 'next')?.url;
   //       const result = this.bundleHelperService.mapBundleToEntries(data);
   //       return result;
   //     }),
   //     map(decedentRecords =>
   //       decedentRecords
   //         .filter(record =>
   //           record?.meta?.profile?.indexOf(this.fhirProfiles.DCR.Dcr_Structure_Definition) == -1
   //         )
   //     ),
   //     mergeMap((decedentRecordsList: any[]) =>
   //       forkJoin(
   //         decedentRecordsList.map((decedentRecord: any, i) =>
   //           this.decedentService.getDecedentObservationsByCode(decedentRecord, codes).pipe(
   //             map((observation: any) => {
   //               decedentRecord = this.mapToDto(decedentRecord);
   //               const tod = observation?.entry?.find(entry => entry.resource?.code?.coding[0]?.code == loincTimeOfDeath)?.resource?.valueDateTime;
   //               decedentRecord.tod = tod;
   //               const mannerOfDeath =  observation?.entry?.find(entry => entry.resource?.code?.coding?.[0]?.code == loincCauseOfDeath)?.resource?.valueCodeableConcept?.coding?.[0]?.display;
   //               decedentRecord.mannerOfDeath = mannerOfDeath;
   //               decedentRecord.index = i + 1;
   //               return decedentRecord;
   //             })
   //           )
   //         ))
   //     )
   //   ).pipe(
   //     mergeMap((decedentRecordsList: any[]) =>
   //       forkJoin(
   //         decedentRecordsList.map((decedentRecord: any, i) =>
   //           this.decedentService.getComposition(decedentRecord.decedentId).pipe(
   //             map((searchset: any) => {
   //               const mdiSystem = this.fhirHelperService.getTrackingNumberSystem(searchset?.entry?.[0]?.resource, TrackingNumberType.Mdi);
   //               decedentRecord.system = mdiSystem;
   //               const caseNumber = searchset?.entry?.[0]?.resource?.extension?.[0]?.valueIdentifier?.value;
   //               decedentRecord.caseNumber = caseNumber;
   //               return decedentRecord
   //             })
   //           )
   //         ))
   //     )
   //   )
   //     .subscribe({
   //       next: (data) => {
   //         this.decedentGridDtoList = data.filter(record => !!record.caseNumber);
   //         this.dataSource = new MatTableDataSource(this.decedentGridDtoList);
   //         this.dataSource.sort = this.sort;
   //         this.mannerOfDeathList = this.getMannerOfDeathList(this.decedentGridDtoList);
   //         this.setDataSourceFilters();
   //       },
   //       error: (e) => {
   //         this.isLoading = false;
   //         console.error(e);
   //         this.serverErrorEventEmitter.emit();
   //       },
   //       complete:  () => {
   //         this.isLoading = false;
   //       },
   //     });

   //}

  ngOnInit(): void {
    this.getDecedentRecords(this.currentPage, this.pageSize);
    // const loincCauseOfDeath = '69449-7';
    // const loincTimeOfDeath = '81956-5';
    // const codes = [loincCauseOfDeath, loincTimeOfDeath];
    // this.isLoading = true;
    // // NOTE: Decedents are FHIR Patient resources.
    // this.decedentService.getDecedentRecords().pipe(
    //   map(data => {
    //     console.log(data);
    //     return data
    //   }),
    //   map(decedentRecords =>
    //     decedentRecords
    //       .filter(record =>
    //         record?.meta?.profile?.indexOf(this.fhirProfiles.DCR.Dcr_Structure_Definition) == -1
    //       )
    //   ),
    //   mergeMap((decedentRecordsList: any[]) =>
    //     forkJoin(
    //       decedentRecordsList.map((decedentRecord: any, i) =>
    //         this.decedentService.getDecedentObservationsByCode(decedentRecord, codes).pipe(
    //           map((observation: any) => {
    //             decedentRecord = this.mapToDto(decedentRecord);
    //             const tod = observation?.entry?.find(entry => entry.resource?.code?.coding[0]?.code == loincTimeOfDeath)?.resource?.valueDateTime;
    //             decedentRecord.tod = tod;
    //             const mannerOfDeath =  observation?.entry?.find(entry => entry.resource?.code?.coding?.[0]?.code == loincCauseOfDeath)?.resource?.valueCodeableConcept?.coding?.[0]?.display;
    //             decedentRecord.mannerOfDeath = mannerOfDeath;
    //             decedentRecord.index = i + 1;
    //             return decedentRecord;
    //           })
    //         )
    //       ))
    //   )
    // ).pipe(
    //   mergeMap((decedentRecordsList: any[]) =>
    //     forkJoin(
    //       decedentRecordsList.map((decedentRecord: any, i) =>
    //           this.decedentService.getComposition(decedentRecord.decedentId).pipe(
    //           map((searchset: any) => {
    //             const mdiSystem = this.fhirHelperService.getTrackingNumberSystem(searchset?.entry?.[0]?.resource, TrackingNumberType.Mdi);
    //             decedentRecord.system = mdiSystem;
    //             const caseNumber = searchset?.entry?.[0]?.resource?.extension?.[0]?.valueIdentifier?.value;
    //             decedentRecord.caseNumber = caseNumber;
    //             return decedentRecord
    //           })
    //         )
    //       ))
    //   )
    // )
    // .subscribe({
    //     next: (data) => {
    //       this.decedentGridDtoList = data.filter(record => !!record.caseNumber);
    //       this.dataSource = new MatTableDataSource(this.decedentGridDtoList);
    //       this.dataSource.sort = this.sort;
    //       this.mannerOfDeathList = this.getMannerOfDeathList(this.decedentGridDtoList);
    //       this.setDataSourceFilters();
    //     },
    //     error: (e) => {
    //       this.isLoading = false;
    //       console.error(e);
    //       this.serverErrorEventEmitter.emit();
    //     },
    //     complete:  () => {
    //       this.isLoading = false;
    //     },
    // });
  }

  onCaseSelected(row: any) {
    this.router.navigate([`${this.appConfig.modules['recordViewer'].route}/mdi/`, row.decedentId]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAgeFromDob(birthday: any) {
    const ageDifMs = Date.now() - birthday;
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  private getMannerOfDeathList(decedentGridDtoList: DecedentGridDTO[]) {
    const result = [...new Set (decedentGridDtoList.map(decedent => decedent.mannerOfDeath))].filter(element => !!element);
    return result;
  }

  applyMannerOfDeathFilter() {
    const mannerOfDeath = this.mannerOfDeathSelect.value;
    this.dataSource.filter = mannerOfDeath;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private setDataSourceFilters() {
    this.pipe = new DatePipe('en');
    const defaultPredicate = this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data, filter) => {
      const formatted = this.pipe.transform(data.tod,'MM/dd/yyyy');
      return formatted.indexOf(filter) >= 0 || defaultPredicate(data,filter) ;
    }
  }

  onClearFilters() {
    this.mannerOfDeathSelect.value = null;
    this.input.nativeElement.value = '';
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // onPageChanged(event: PageEvent) {
  //   if(event.pageIndex == 0){
  //     // loading the first page requested
  //   }
  //   if (this.defaultPageSize !== event.pageSize) {
  //     this.defaultPageSize = event.pageSize;
  //     this.getDecedentRecords();
  //     return; //changing the page size reloads the grid from the first page and new page size.
  //   }
  //
  //   //page changed detection
  //   if (event.pageIndex > event.previousPageIndex && this.urlNext) {
  //     this.getNext(this.urlNext);
  //   } else if(event.pageIndex < event.previousPageIndex && this.urlPrevious){
  //     this.getPrevious(this.urlNext);
  //   }
  // }


  onPageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getDecedentRecords(this.currentPage, this.pageSize);
    // if(event.pageIndex == 0){
    //   // loading the first page requested
    // }
    // if (this.pageSize !== event.pageSize) {
    //   this.pageSize = event.pageSize;
    //   this.getDecedentRecords();
    //   return; //changing the page size reloads the grid from the first page and new page size.
    // }
    //
    // //page changed detection
    // if (event.pageIndex > event.previousPageIndex && this.urlNext) {
    //   this.getNext(this.urlNext);
    // } else if(event.pageIndex < event.previousPageIndex && this.urlPrevious){
    //   this.getPrevious(this.urlNext);
    // }
  }
}
