import {Component, ElementRef, EventEmitter, OnInit, output, input, Output, signal, ViewChild} from '@angular/core';
import {forkJoin, map, mergeMap} from "rxjs";
import {ToxicologyGridDto} from "../../../../../model/toxicology.grid.dto";
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatNoDataRow } from "@angular/material/table";
import {AppConfiguration} from "../../../../../providers/app-configuration";
import {ToxToMdiMessageHandlerService} from "../../../services/tox-to-mdi-message-handler.service";
import {TrackingNumberType} from "../../../../fhir-mdi-library";
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { NgClass, TitleCasePipe, DatePipe } from '@angular/common';

@Component({
    selector: 'record-viewer-toxicology-grid',
    templateUrl: './toxicology-grid.component.html',
    styleUrls: ['../../../record-viewer-styles.scss', '../search-records.component.scss'],
    imports: [MatFormField, MatLabel, MatInput, MatButton, MatProgressSpinner, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatTooltip, NgClass, MatNoDataRow, TitleCasePipe, DatePipe]
})
export class ToxicologyGridComponent implements OnInit {
  currentModule = input('recordViewer');
  selectedToxRecord = signal<ToxicologyGridDto | null>(null);

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['lastName', 'reportdate', 'toxcasenumber', 'toxcasesystem', 'mdicasenumber', 'mdicasesystem'];
  isLoading = signal(false);
  showSystems = false;

  appConfiguration: AppConfiguration = AppConfiguration.config;

  @ViewChild('input') input: ElementRef;

  @Output() serverErrorEventEmitter = new EventEmitter();
  onToxRecordSelected = output<ToxicologyGridDto>();



  constructor(
    private toxicologyHandler: ToxToMdiMessageHandlerService,
  ) {
  }

  ngOnInit(): void {
    this.isLoading.set(true);
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
        this.dataSource.data = data;
        this.isLoading.set(false);
      },
      error: (e) => {
        console.error(e);
        this.isLoading.set(false);
        this.serverErrorEventEmitter.emit();
      },
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
