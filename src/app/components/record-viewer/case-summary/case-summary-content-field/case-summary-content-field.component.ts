import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-case-summary-content-field',
  templateUrl: './case-summary-content-field.component.html',
  styleUrls: ['./case-summary-content-field.component.scss']
})
export class CaseSummaryContentFieldComponent implements OnInit {
  @Input() label: string;
  @Input() value: any;

  constructor() { }

  ngOnInit(): void {
  }

}
