import {Component, Inject, Input, ViewChild} from '@angular/core';
import {MatAccordion} from "@angular/material/expansion";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../../providers/app-configuration";
import {FHIRProfileConstants} from "../../../../../providers/fhir-profile-constants";

@Component({
  selector: 'app-dcr-viewer-content',
  standalone: false,
  templateUrl: './dcr-viewer-content.component.html',
  styleUrl: './dcr-viewer-content.component.css'
})
export class DcrViewerContentComponent {
  @Input() dcrRecord: any; //TODO change the type to class or interface
  @ViewChild(MatAccordion) accordion: MatAccordion;

  idStateList = [
    { expanded: true, id: 'caseAdminInfo' },
    { expanded: false, id: 'demographics' },
    { expanded: false, id: 'deathInvestigation' },
    { expanded: false, id: 'cremationClearance' },
    { expanded: false, id: 'signature' },
  ];

  constructor(
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration,
    @Inject('fhirProfiles') public fhirProfiles: FHIRProfileConstants
  ) {
  }

  onSetState(resourceId){
    this.idStateList = this.idStateList.map(
      (element) => element.id === resourceId ? {id: element.id, expanded: true} : element);
    document.getElementById(resourceId).scrollIntoView({behavior: "smooth"});
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
