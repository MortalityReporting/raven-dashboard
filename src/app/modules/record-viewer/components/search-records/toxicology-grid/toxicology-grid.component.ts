import {Component, ElementRef, EventEmitter, Inject, OnInit, output, Output, signal, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
import {forkJoin, map, mergeMap} from "rxjs";
import {ToxicologyGridDto} from "../../../../../model/toxicology.grid.dto";
import {MatTableDataSource} from "@angular/material/table";
import {AppConfiguration} from "../../../../../providers/app-configuration";
import {ToxToMdiMessageHandlerService} from "../../../services/tox-to-mdi-message-handler.service";
import {TrackingNumberType} from "../../../../fhir-mdi-library";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";

@Component({
    selector: 'record-viewer-toxicology-grid',
    templateUrl: './toxicology-grid.component.html',
    styleUrls: ['../../../record-viewer-styles.scss', '../search-records.component.scss'],
    standalone: false
})
export class ToxicologyGridComponent implements OnInit {


  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['lastName', 'reportdate', 'toxcasenumber', 'toxcasesystem', 'mdicasenumber', 'mdicasesystem'];
  toxGridDtoList: ToxicologyGridDto[];
  isLoading = true;
  showSystems = false;
  selectedToxRecord = signal<ToxicologyGridDto>(null)

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  @Output() serverErrorEventEmitter = new EventEmitter();
  onToxRecordSelected = output<ToxicologyGridDto>();



  constructor(
    private route: ActivatedRoute,
    private toxicologyHandler: ToxToMdiMessageHandlerService,
    @Inject('appConfig') public appConfig: AppConfiguration,
    @Inject('config') public config: ModuleHeaderConfig
  ) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.selectedToxRecord.set(null);

    // TODO: Add logic to skip invalid records missing either a subject or tox tracking number.
    this.toxicologyHandler.getToxicologyRecords().pipe(
      mergeMap((diagnosticReportList: any[]) =>
        forkJoin(
          diagnosticReportList.map((diagnosticReport: any) =>
            this.toxicologyHandler.getSubject(diagnosticReport).pipe(
              map((subject: any) => {
                let diagnosticReportDto = this.mapToDto(diagnosticReport, subject);
                return diagnosticReportDto;
              })
            )
          ))
      )
    ).subscribe({
      next: (data) => {
        this.toxGridDtoList = []; // Initialize data.
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (e) => {
        console.error(e);
        this.isLoading = false;
        this.serverErrorEventEmitter.emit();
      },
      complete:  () => {
        this.isLoading = false
      }
    });
  }

  // This function requires the diagnosticReport resource, not the bundle entry component.
  mapToDto(diagnosticReport: any, subject: any): ToxicologyGridDto {
    let toxDto = new ToxicologyGridDto();
    toxDto.firstName = subject?.name[0]?.given[0];
    toxDto.lastName = subject?.name[0]?.family;
    toxDto.reportdate = diagnosticReport?.issued
    const toxTrackingNumber = this.toxicologyHandler.getTrackingNumber(diagnosticReport, TrackingNumberType.Tox);
    const mdiTrackingNumber = this.toxicologyHandler.getTrackingNumber(diagnosticReport, TrackingNumberType.Mdi);
    toxDto.toxcasenumber = toxTrackingNumber?.value || undefined;
    toxDto.toxcasesystem = toxTrackingNumber?.system || undefined;
    toxDto.mdicasenumber = mdiTrackingNumber?.value || undefined;
    toxDto.mdicasesystem = mdiTrackingNumber?.system || undefined;

    if (!toxDto.toxcasenumber || !toxDto.toxcasesystem) {
      toxDto.error = true;
    }
    return toxDto;
  }

  onCaseSelected(row: any) {
    this.selectedToxRecord.set(row);
    this.onToxRecordSelected.emit(row);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onClearFilters() {
    this.input.nativeElement.value = '';
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
