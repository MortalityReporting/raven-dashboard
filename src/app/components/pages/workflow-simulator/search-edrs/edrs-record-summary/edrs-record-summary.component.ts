import {Component, Input, OnInit} from '@angular/core';
import {UiStringConstants} from "../../../../../providers/ui-string-constants";

@Component({
  selector: 'app-edrs-record-summary',
  templateUrl: './edrs-record-summary.component.html',
  styleUrls: ['./edrs-record-summary.component.css']
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
