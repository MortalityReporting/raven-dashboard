import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'record-viewer-case-summary-related-tox',
  templateUrl: './case-summary-related-tox.component.html',
  styleUrls: ['../case-summary.component.scss']
})
export class CaseSummaryRelatedToxComponent implements OnInit, AfterViewInit {
  @Input() toxicologyRecordList: any[];
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<any>;
  displayedColumns = ["date", "toxCaseNumber", "toxCaseSystem"];

  constructor(
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.toxicologyRecordList);
  }

  onRowClicked(row: any) {
    this.router.navigate(['records/tox/', row.toxCaseSystem + "|" + row.toxCaseNumber]);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
}
