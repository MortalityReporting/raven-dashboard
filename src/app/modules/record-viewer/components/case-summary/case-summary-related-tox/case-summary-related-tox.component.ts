import {AfterViewInit, Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {ModuleHeaderConfig} from "../../../../../../assets/configuration/module-header-config";
import {AppConfiguration} from "../../../../../../assets/configuration/app-configuration";

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
    private route: ActivatedRoute,
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration
    ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.toxicologyRecordList);
  }

  onRowClicked(row: any) {
    console.log("/" + this.appConfig.modules['recordViewer'].route + "/tox/" + row.toxCaseSystem + "|" + row.toxCaseNumber);
    this.router.navigateByUrl("/" + this.appConfig.modules['recordViewer'].route + "/tox/" + encodeURIComponent(row.toxCaseSystem + "|" + row.toxCaseNumber));
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
}
