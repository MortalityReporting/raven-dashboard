import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-edrs-record-summary',
  templateUrl: './edrs-record-summary.component.html',
  styleUrls: ['./edrs-record-summary.component.css']
})
export class EdrsRecordSummaryComponent implements OnInit {
  @Input() edrsRecord: any;

  constructor() { }

  ngOnInit(): void {
  }

}
