import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {AppConfiguration} from "../../../../../assets/configuration/app-configuration";

@Component({
  selector: 'record-viewer-search-records',
  templateUrl: './search-records.component.html',
  styleUrls: ['./search-records.component.scss']
})
export class SearchRecordsComponent implements OnInit, OnDestroy {

  sessionStorageLastTabKey = "searchTab";
  selectedTabIndex = 0;

  constructor(
    @Inject('appConfig') public appConfig: AppConfiguration
  ) { }

  ngOnInit(): void {
    this.selectedTabIndex = parseInt(sessionStorage.getItem(this.sessionStorageLastTabKey));
  }

  ngOnDestroy(): void {
    sessionStorage.setItem(this.sessionStorageLastTabKey, `${this.selectedTabIndex}`);
  }
}
