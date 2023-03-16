import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FhirResourceProviderService} from "../../../../../service/fhir-resource-provider.service";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";

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

  constructor(private fhirResourceProvider: FhirResourceProviderService) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.displayedColumns = this.columns;
  }

  capitalizeColumnHeader(column: string): string {
    return column.charAt(0).toUpperCase() + column.slice(1);
  }

  onRowClicked(row: any) {
    this.fhirResourceProvider.setSelectedFhirResource(row.resource);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
}
