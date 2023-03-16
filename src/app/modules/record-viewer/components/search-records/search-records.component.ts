import {Component, Inject, OnInit} from '@angular/core';
import {AppConfiguration} from "../../../../../assets/configuration/app-configuration";

@Component({
  selector: 'record-viewer-search-records',
  templateUrl: './search-records.component.html',
  styleUrls: ['./search-records.component.scss']
})
export class SearchRecordsComponent implements OnInit {

  constructor(
    @Inject('appConfig') public appConfig: AppConfiguration
  ) { }

  ngOnInit(): void {
  }

}
