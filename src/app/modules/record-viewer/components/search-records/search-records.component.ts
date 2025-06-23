import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {AppConfiguration} from "../../../../providers/app-configuration";
import {Router} from "@angular/router";

@Component({
    selector: 'record-viewer-search-records',
    templateUrl: './search-records.component.html',
    styleUrls: ['./search-records.component.scss', '../../record-viewer-styles.scss'],
    standalone: false
})
export class SearchRecordsComponent implements OnInit, OnDestroy {

  sessionStorageLastTabKey = "searchTab";
  selectedTabIndex = 0;
  serverErrorDetected: boolean = false;

  constructor(
    private router: Router,
    @Inject('appConfig') public appConfig: AppConfiguration
  ) { }

  ngOnInit(): void {
    this.selectedTabIndex = parseInt(sessionStorage.getItem(this.sessionStorageLastTabKey));
    this.serverErrorDetected = false;
  }

  ngOnDestroy(): void {
    sessionStorage.setItem(this.sessionStorageLastTabKey, `${this.selectedTabIndex}`);
  }

  onPageReload() {
    window.location.reload();
  }

  onServerErrorDetected() {
    this.serverErrorDetected = true;
  }

  onToxRecordSelected(toxRecord: any) {
    this.router.navigate([`${this.appConfig.modules['recordViewer'].route}/tox/`, toxRecord.toxcasesystem + "|" + toxRecord.toxcasenumber]);
  }
}
