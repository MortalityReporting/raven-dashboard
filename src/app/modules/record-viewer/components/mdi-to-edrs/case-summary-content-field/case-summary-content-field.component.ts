import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'record-viewer-case-summary-content-field',
  templateUrl: './case-summary-content-field.component.html',
  styleUrls: ['./case-summary-content-field.component.scss', '../../../record-viewer-styles.scss']
})
export class CaseSummaryContentFieldComponent implements OnInit {
  @Input() label: string;
  @Input() value: any;

  constructor() { }

  ngOnInit(): void {
  }

}
