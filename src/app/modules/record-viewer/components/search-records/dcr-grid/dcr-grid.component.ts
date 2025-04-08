import {Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../../providers/app-configuration";
import {Router} from "@angular/router";
import {DcrDocumentHandlerService} from "../../../services/dcr-document-handler.service";
import {MatSort} from "@angular/material/sort";
import {DcrGridDTO} from "../../../models/dcr-record";

@Component({
  selector: 'dcr-grid',
  standalone: false,
  templateUrl: './dcr-grid.component.html',
  styleUrl: './dcr-grid.component.scss'
})
export class DcrGridComponent implements OnInit {
  @Output() serverErrorEventEmitter = new EventEmitter();
  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<DcrGridDTO>();
  displayedColumns: string[] = ['name', 'gender', 'deathDate', 'caseNumber'];

  isLoading = false;

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
    this.isLoading = true;
    this.dcrDocumentHandlerService.getRecords().subscribe({
      next: data => {
        console.log(data);
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      },
      error: error => {
        this.isLoading = false;
        console.error(error);
        this.serverErrorEventEmitter.emit();
      },
      complete: () => {
        this.isLoading = false;
      }
      }
    )
  }
}
