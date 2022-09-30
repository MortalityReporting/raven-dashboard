import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-case-comparison-content-field',
  templateUrl: './case-comparison-content-field.component.html',
  styleUrls: ['./case-comparison-content-field.component.css']
})
export class CaseComparisonContentFieldComponent implements OnInit {
  @Input() state: string;
  @Input() title: string;
  @Input() resource: string;
  @Input() fhirPath: string;
  @Input() actual: string;
  @Input() expected: string;
  @Input() difference: string;

  constructor() { }

  ngOnInit(): void {
  }
}