import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MatAccordion, MatExpansionPanel} from "@angular/material/expansion";
import {ToxHeader} from "../../../models/tox.header";
import {ToxSummary} from "../../../models/tox.summary";
import {ModuleHeaderConfig} from "../../../../../../assets/configuration/module-header-config";
import {AppConfiguration} from "../../../../../../assets/configuration/app-configuration";
import {FHIRProfileConstants} from "../../../../../providers/fhir-profile-constants";

@Component({
  selector: 'record-viewer-toxicology-report-content',
  templateUrl: './toxicology-report-content.component.html',
  styleUrls: ['../toxicology-report.component.scss', '../../../record-viewer-styles.scss']
})
export class ToxicologyReportContentComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() toxHeader: ToxHeader;
  @Input() toxSummary: ToxSummary;
  @Input() messageBundle: any;

  idStateList = [
    { expanded: true,    id: 'performers' },
    { expanded: true,    id: 'specimens' },
    { expanded: true,    id: 'results' },
    { expanded: true,    id: 'conclusion' }
  ]

  constructor(
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration,
    @Inject('fhirProfiles') public fhirProfiles: FHIRProfileConstants
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

  onSetState(resourceId, state){
    this.idStateList = this.idStateList.map((element) => element.id === resourceId ? {id: element.id, expanded: true} : element);
    document.getElementById(resourceId).scrollIntoView({behavior: "smooth"});
  }

  isExpanded(elementId: string) {
    return this.idStateList.find(element => element.id == elementId)?.expanded;
  }

}
