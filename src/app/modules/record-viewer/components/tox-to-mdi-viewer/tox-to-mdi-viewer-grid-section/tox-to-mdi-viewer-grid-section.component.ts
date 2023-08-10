import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {FhirExplorerService} from "../../../../fhir-explorer/services/fhir-explorer.service";

@Component({
  selector: 'record-viewer-tox-to-mdi-viewer-grid-section',
  templateUrl: './tox-to-mdi-viewer-grid-section.component.html',
  styleUrls: ['../tox-to-mdi-viewer.component.css']
})
export class ToxToMdiViewerGridSectionComponent implements OnInit {
  @Input() data: any[];
  @Input() columns: string[] = [];
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  };  dataSource: MatTableDataSource<any>;
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
}
