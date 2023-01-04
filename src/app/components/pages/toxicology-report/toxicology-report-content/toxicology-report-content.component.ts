import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatAccordion} from "@angular/material/expansion";
import {ToxHeader} from "../../../../model/record-models/tox.header";
import {ToxSummary} from "../../../../model/record-models/tox.summary";

@Component({
  selector: 'app-toxicology-report-content',
  templateUrl: './toxicology-report-content.component.html',
  styleUrls: ['../toxicology-report.component.css']
})
export class ToxicologyReportContentComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() toxHeader: ToxHeader;
  @Input() toxSummary: ToxSummary;

  idStateList = [
    { expanded: true,    id: 'performers' },
    { expanded: true,    id: 'specimens' },
    { expanded: true,    id: 'testresults' },
    { expanded: true,    id: 'conclusion' }
  ]

  constructor(
  ) { }

  ngOnInit(): void {
  }

  onToggleState(id: any ) {
    this.idStateList = this.idStateList.map(element => element.id == id ? {id: element.id, expanded: !element.expanded}: element);
  }

  onOpenAll() {
    this.idStateList.forEach(element => element.expanded = true);
    this.accordion.openAll()
  }

  onCloseAll() {
    this.idStateList.forEach(element => element.expanded = false);
    this.accordion.closeAll()
  }

  isExpanded(elementId: string) {
    return this.idStateList.find(element => element.id == elementId)?.expanded;
  }
}
