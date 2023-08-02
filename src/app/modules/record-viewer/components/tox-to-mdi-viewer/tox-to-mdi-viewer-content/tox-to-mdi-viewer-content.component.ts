import {Component, Inject, Input, ViewChild} from '@angular/core';
import {ToxToMdiRecord} from "../../../models/toxToMdiRecord";
import {MatAccordion} from "@angular/material/expansion";
import {FHIRProfileConstants} from "../../../../../providers/fhir-profile-constants";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../../providers/app-configuration";

@Component({
  selector: 'record-viewer-tox-to-mdi-viewer-content',
  templateUrl: './tox-to-mdi-viewer-content.component.html',
  styleUrls: ['../tox-to-mdi-viewer.component.css']
})
export class ToxToMdiViewerContentComponent {
  @Input() toxToMdiRecord: ToxToMdiRecord;
  @ViewChild(MatAccordion) accordion: MatAccordion;

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
  ) {
  }

  onOpenAll() {
    this.idStateList.forEach(element => element.expanded = true);
    this.accordion.openAll()
  }

  onCloseAll() {
    this.idStateList.forEach(element => element.expanded = false);
    this.accordion.closeAll()
  }

  onToggleState(id: any ) {
    this.idStateList = this.idStateList.map(element => element.id == id ? {id: element.id, expanded: !element.expanded}: element);
  }
  isExpanded(elementId: string) {
    return this.idStateList.find(element => element.id == elementId)?.expanded;
  }
}
