import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {AppConfiguration} from "../../../../providers/app-configuration";
import {Router} from "@angular/router";
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { DecedentRecordsGridComponent } from './decedent-records-grid/decedent-records-grid.component';
import { ToxicologyGridComponent } from './toxicology-grid/toxicology-grid.component';
import { DcrGridComponent } from './dcr-grid/dcr-grid.component';
import { CommonErrorComponent } from '../../../../components/widgets/common-error/common-error.component';

@Component({
    selector: 'record-viewer-search-records',
    templateUrl: './search-records.component.html',
    styleUrls: ['./search-records.component.scss', '../../record-viewer-styles.scss'],
    imports: [MatCard, MatCardContent, MatTabGroup, MatTab, DecedentRecordsGridComponent, ToxicologyGridComponent, DcrGridComponent, CommonErrorComponent]
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
