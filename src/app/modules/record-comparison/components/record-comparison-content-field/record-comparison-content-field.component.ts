import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatExpansionPanel} from "@angular/material/expansion";

@Component({
  selector: 'record-comparison-content-field',
  templateUrl: './record-comparison-content-field.component.html',
  styleUrls: ['./record-comparison-content-field.component.scss']
})
export class RecordComparisonContentFieldComponent implements OnInit, OnChanges{
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
