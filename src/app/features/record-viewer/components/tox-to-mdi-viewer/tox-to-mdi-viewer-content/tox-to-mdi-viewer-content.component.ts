import {AfterViewInit, Component, Inject, input, Input, OnInit, ViewChild} from '@angular/core';
import {ToxToMdiRecord} from "../../../models/toxToMdiRecord";
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from "@angular/material/expansion";
import {FHIRProfileConstants} from "../../../../../providers/fhir-profile-constants";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../../providers/app-configuration";
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ToxToMdiViewerMdiCaseComponent } from '../tox-to-mdi-viewer-mdi-case/tox-to-mdi-viewer-mdi-case.component';
import { ToxDemoCardComponent } from '../tox-demo-card/tox-demo-card.component';
import { ToxToMdiViewerCertifierComponent } from '../tox-to-mdi-viewer-certifier/tox-to-mdi-viewer-certifier.component';
import { ToxToMdiViewerGridSectionComponent } from '../tox-to-mdi-viewer-grid-section/tox-to-mdi-viewer-grid-section.component';
import { SetFhirExplorerDirective } from '../../../../fhir-explorer/directives/set-fhir-explorer.directive';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'record-viewer-tox-to-mdi-viewer-content',
    templateUrl: './tox-to-mdi-viewer-content.component.html',
    styleUrls: ['../tox-to-mdi-viewer.component.css'],
    imports: [MatButton, MatIcon, ToxToMdiViewerMdiCaseComponent, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, ToxDemoCardComponent, ToxToMdiViewerCertifierComponent, ToxToMdiViewerGridSectionComponent, SetFhirExplorerDirective, FormsModule]
})
export class ToxToMdiViewerContentComponent implements AfterViewInit {
  currentModule = input('recordViewer');
  collapseAllSections = input<boolean>(false);
  appConfiguration: AppConfiguration = AppConfiguration.config;

  @Input() toxToMdiRecord: ToxToMdiRecord;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  idStateList = [
    { expanded: true, id: 'demographics' },
    { expanded: true, id: 'performers' },
    { expanded: true, id: 'specimens' },
    { expanded: true, id: 'results' },
    { expanded: true, id: 'conclusion' }
  ]

  constructor(
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration,
    @Inject('fhirProfiles') public fhirProfiles: FHIRProfileConstants
  ) {
  }

  ngAfterViewInit(): void {
    if(this.collapseAllSections()){
      this.onCloseAll();
    }
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

  protected readonly ToxToMdiRecord = ToxToMdiRecord;

}
