import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatAccordion, MatExpansionPanel} from "@angular/material/expansion";

@Component({
  selector: 'app-case-comparison-content-field',
  templateUrl: './case-comparison-content-field.component.html',
  styleUrls: ['./case-comparison-content-field.component.css']
})
export class CaseComparisonContentFieldComponent implements OnInit, OnChanges{
  @Input() state: string;
  @Input() title: string;
  @Input() resource: string;
  @Input() fhirPath: string;
  @Input() actual: string;
  @Input() expected: string;
  @Input() difference: string;
  @Input() expanded: boolean;

  @ViewChild(MatExpansionPanel) matExpansionPanel: MatExpansionPanel;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['expanded']?.currentValue == false && this.matExpansionPanel?.expanded){
      this.matExpansionPanel.close();
    }
  }
}
