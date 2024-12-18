import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MatAccordion} from "@angular/material/expansion";
import {ActivatedRoute, Router} from "@angular/router";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../../providers/app-configuration";
import {MdiToEdrsRecord} from "../../../models/mdiToEdrsRecord";
import {FHIRProfileConstants} from "../../../../../providers/fhir-profile-constants";

@Component({
    selector: 'record-viewer-mdi-to-edrs-viewer-content',
    templateUrl: './mdi-to-edrs-viewer-content.component.html',
    styleUrls: ['../mdi-to-edrs-viewer.component.scss', '../../../record-viewer-styles.scss'],
    standalone: false
})
export class MdiToEdrsViewerContentComponent implements OnInit {
  @Input() mdiToEdrsRecord: MdiToEdrsRecord;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  idStateList = [
    { expanded: true,     id: 'caseAdminInfo' },
    { expanded: false,    id: 'demographics' },
    { expanded: false,    id: 'jurisdiction' },
    { expanded: false,    id: 'causeAndManner' },
    { expanded: false,    id: 'medicalHistory' },
    { expanded: false,    id: 'narratives' },
    { expanded: false,    id: 'circumstances' },
    { expanded: false,    id: 'examAndAutopsy' },
  ]

  ids = ["ID-1", "ID-2", "ID-3"];
  selectedId = "ID-1";

  author: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,

    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration,
    @Inject('fhirProfiles') public fhirProfiles: FHIRProfileConstants
  ) {
  }

  ngOnInit(): void {}

  onToggleState(id: any ) {
    this.idStateList = this.idStateList.map(element => element.id == id ? {id: element.id, expanded: !element.expanded}: element);
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

  onOpenInComparisonTool() {
    this.router.navigate([this.appConfig.modules['recordComparison'].route, this.mdiToEdrsRecord.compositionId]);
  }

  isExpanded(elementId: string) {
    return this.idStateList.find(element => element.id == elementId)?.expanded;
  }
}
