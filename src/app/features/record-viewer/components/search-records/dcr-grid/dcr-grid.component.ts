import {Component, ElementRef, EventEmitter, Inject, OnInit, Output, signal, ViewChild} from '@angular/core';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatNoDataRow } from "@angular/material/table";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../../providers/app-configuration";
import {Router} from "@angular/router";
import {DcrDocumentHandlerService} from "../../../services/dcr-document-handler.service";
import {DcrGridDTO} from "../../../models/dcr-record";
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CustomSpinnerDirective } from '../../../directives/custom-spinner.directive';
import { TitleCasePipe, DatePipe } from '@angular/common';

@Component({
    selector: 'dcr-grid',
    templateUrl: './dcr-grid.component.html',
    styleUrls: ['../../../record-viewer-styles.scss', '../search-records.component.scss'],
    imports: [
        MatFormField,
        MatLabel,
        MatInput,
        MatButton,
        MatTable,
        MatColumnDef,
        MatHeaderCellDef,
        MatHeaderCell,
        MatCellDef,
        MatCell,
        MatHeaderRowDef,
        MatHeaderRow,
        MatRowDef,
        MatRow,
        MatNoDataRow,
        MatProgressSpinner,
        CustomSpinnerDirective,
        TitleCasePipe,
        DatePipe,
    ],
})
export class DcrGridComponent implements OnInit{
  @Output() serverErrorEventEmitter = new EventEmitter();
  @ViewChild('input') input: ElementRef;

  dataSource = new MatTableDataSource<DcrGridDTO>();
  //displayedColumns: string[] = ['name', 'gender', 'deathDate', 'funeralHomeName'];
  // TODO uncomment when we know how to use gender/sex fields per the CDC guidelines. Note that gender should come from Sex at Death
  displayedColumns: string[] = ['name',  'deathDate', 'funeralHomeName'];

  isLoading = signal(false);

  constructor(
    private router: Router,
    private dcrDocumentHandlerService: DcrDocumentHandlerService,
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
    this.router.navigate([`${this.appConfig.modules['recordViewer'].route}/dcr/`, row.recordId]);
  }

  onClearFilters() {
    this.input.nativeElement.value = '';
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.isLoading.set(true);
    this.dcrDocumentHandlerService.getRecords().subscribe({
      next: data => {
        this.isLoading.set(false);
        this.dataSource.data = data;
      },
      error: error => {
        this.isLoading.set(false);
        console.error(error);
        this.serverErrorEventEmitter.emit();
      }
      }
    )
  }
}
