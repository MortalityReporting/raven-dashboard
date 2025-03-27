import {Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../../providers/app-configuration";
import {Router} from "@angular/router";
import {map} from "rxjs";
import {DecedentService} from "../../../services/decedent.service";

@Component({
  selector: 'dcr-grid',
  standalone: false,
  templateUrl: './dcr-grid.component.html',
  styleUrl: './dcr-grid.component.scss'
})
export class DcrGridComponent implements OnInit {
  @Output() serverErrorEventEmitter = new EventEmitter();
  @ViewChild('input') input: ElementRef;

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['lastName', 'gender', 'tod', 'caseNumber'];

  isLoading = false;

  constructor(
    private router: Router,
    private decedentService: DecedentService,
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration
  ){}

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onCaseSelected(row: any) {
    this.router.navigate([`${this.appConfig.modules['recordViewer'].route}/dcr/`, row.decedentId]);
  }

  onClearFilters() {
    this.input.nativeElement.value = '';
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.decedentService.getDecedentRecords().pipe(
      map(data => {
        // console.log(data);
        return data
      }),
      // mergeMap((decedentRecordsList: any[]) =>
      //   forkJoin(
      //     decedentRecordsList.map((decedentRecord: any, i) =>
      //       this.decedentService.getDecedentObservationsByCode(decedentRecord, codes).pipe(
      //         map((observation: any) => {
      //           decedentRecord = this.mapToDto(decedentRecord);
      //           const tod = observation?.entry?.find(entry => entry.resource?.code?.coding[0]?.code == loincTimeOfDeath)?.resource?.valueDateTime;
      //           decedentRecord.tod = tod;
      //           const mannerOfDeath =  observation?.entry?.find(entry => entry.resource?.code?.coding?.[0]?.code == loincCauseOfDeath)?.resource?.valueCodeableConcept?.coding?.[0]?.display;
      //           decedentRecord.mannerOfDeath = mannerOfDeath;
      //           decedentRecord.index = i + 1;
      //           return decedentRecord;
      //         })
      //       )
      //     ))
      // )
    ).pipe(
      // mergeMap((decedentRecordsList: any[]) =>
      //   forkJoin(
      //     decedentRecordsList.map((decedentRecord: any, i) =>
      //       this.decedentService.getComposition(decedentRecord.decedentId).pipe(
      //         map((searchset: any) => {
      //           const mdiSystem = this.fhirHelperService.getTrackingNumberSystem(searchset?.entry?.[0]?.resource, TrackingNumberType.Mdi);
      //           decedentRecord.system = mdiSystem;
      //           const caseNumber = searchset?.entry?.[0]?.resource?.extension?.[0]?.valueIdentifier?.value;
      //           decedentRecord.caseNumber = caseNumber;
      //           return decedentRecord
      //         })
      //       )
      //     ))
      // )
    )
      .subscribe({
        next: (data) => {
          // console.log(data);
          // this.decedentGridDtoList = data.filter(record => !!record.caseNumber);
          // this.dataSource = new MatTableDataSource(this.decedentGridDtoList);
          // this.dataSource.sort = this.sort;
          // this.mannerOfDeathList = this.getMannerOfDeathList(this.decedentGridDtoList);
          // this.setDataSourceFilters();
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




}
