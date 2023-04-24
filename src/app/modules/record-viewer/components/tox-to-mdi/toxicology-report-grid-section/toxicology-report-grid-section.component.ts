import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {FhirExplorerService} from "../../../../fhir-explorer/services/fhir-explorer.service";

@Component({
  selector: 'record-viewer-toxicology-report-grid-section',
  templateUrl: './toxicology-report-grid-section.component.html',
  styleUrls: ['../toxicology-report.component.scss']
})
export class ToxicologyReportGridSectionComponent implements OnInit, AfterViewInit {
  @Input() data: any[];
  @Input() columns: string[] = [];
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  displayedColumns;

  constructor(private fhirExplorerService: FhirExplorerService) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.displayedColumns = this.columns;
  }

  capitalizeColumnHeader(column: string): string {
    return column.charAt(0).toUpperCase() + column.slice(1);
  }

  onRowClicked(row: any) {
    // TODO: This should happen in the component
    this.fhirExplorerService.setSelectedFhirResource(row.resource);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
}
