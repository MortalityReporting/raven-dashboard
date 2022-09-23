import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-case-comparison-content-field',
  templateUrl: './case-comparison-content-field.component.html',
  styleUrls: ['./case-comparison-content-field.component.css']
})
export class CaseComparisonContentFieldComponent implements OnInit {
  @Input() rows: string;
  @Input() title: string;
  @Input() resource: string;
  @Input() fhirPath: string;
  @Input() actualValue: string;
  @Input() expectedValue: string;

  constructor() { }

  ngOnInit(): void {
  }
}