import {AfterViewInit, Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../../providers/app-configuration";

@Component({
  selector: 'record-viewer-mdi-to-edrs-viewer-related-tox',
  templateUrl: './mdi-to-edrs-viewer-related-tox.component.html',
  styleUrls: ['../mdi-to-edrs-viewer.component.scss', '../../../record-viewer-styles.scss']
})
export class MdiToEdrsViewerRelatedToxComponent implements OnInit {
  @Input() toxicologyRecordList: any[];
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  };

  dataSource: MatTableDataSource<any>;
  displayedColumns = ["date", "toxCaseNumber", "toxCaseSystem"];

  constructor(
    private router: Router,
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration
    ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.toxicologyRecordList);
  }

  onRowClicked(row: any) {
    this.router.navigateByUrl("/" + this.appConfig.modules['recordViewer'].route + "/tox/" + encodeURIComponent(row.toxCaseSystem + "|" + row.toxCaseNumber));
  }
}
