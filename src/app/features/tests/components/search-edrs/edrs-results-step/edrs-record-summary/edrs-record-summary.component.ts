import {Component, Input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {UiStringConstants} from "../../../../../../providers/ui-string-constants";
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { JsonPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-edrs-record-summary',
    templateUrl: './edrs-record-summary.component.html',
    styleUrls: ['./edrs-record-summary.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatTabGroup, MatTab, JsonPipe, DatePipe]
})
export class EdrsRecordSummaryComponent implements OnInit {

  @Input() edrsRecord: any;

  uiStrings: any;

  constructor(
    private uiStringConstants: UiStringConstants,
  ) {
    this.uiStrings = this.uiStringConstants.WorkflowSimulator.searchEdrs.step3
  }

  ngOnInit(): void {
  }

}
