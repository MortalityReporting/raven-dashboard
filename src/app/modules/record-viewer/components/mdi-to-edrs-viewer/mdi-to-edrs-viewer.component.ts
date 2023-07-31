import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {MdiToEdrsDocumentHandlerService} from "../../services/mdi-to-edrs-document-handler.service";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../providers/app-configuration";
import {MdiToEdrsViewerContentComponent} from "./mdi-to-edrs-viewer-content/mdi-to-edrs-viewer-content.component";
import {MdiToEdrsRecord} from "../../models/mdiToEdrsRecord";
import {FhirExplorerService} from "../../../fhir-explorer/services/fhir-explorer.service";

@Component({
  selector: 'record-viewer-mdi-to-edrs-viewer',
  templateUrl: './mdi-to-edrs-viewer.component.html',
  styleUrls: ['./mdi-to-edrs-viewer.component.css']
})
export class MdiToEdrsViewerComponent implements OnInit, OnDestroy {
  @ViewChild(MdiToEdrsViewerContentComponent) contentComponent: MdiToEdrsViewerContentComponent;

  /** Inputs to children **/
  mdiToEdrsRecord: MdiToEdrsRecord;

  documentBundle: any = {};
  compositionId: string = "";

  sidenavExpanded = false;
  autosize: boolean = false;

  drawerWidth = "30%"
  drawerCollapsed = true;
  currentRoute: string;


  constructor(
    private route: ActivatedRoute,
    public documentHandler: MdiToEdrsDocumentHandlerService,
    private fhirExplorerService: FhirExplorerService,
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration
  ) { }

  ngOnInit(): void {
    let subjectId = this.route.snapshot.params['id'];
    this.documentHandler.getRecord(subjectId).subscribe({
      next: record => {
        this.fhirExplorerService.setSelectedFhirResource(record.documentBundle);
        this.mdiToEdrsRecord = record;
      }
    });
  }

  onSidenavResize(expanded: boolean) {
    this.sidenavExpanded = expanded;
    this.autosize = true;
    setTimeout(() => this.autosize = false, 1);
  }

  onItemClick(id: string) {
    // this.caseSummaryContentComponent.onSetState(id, true);
  }

  ngOnDestroy(): void {
    this.documentHandler.clearObservablesAndCashedData();
  }

  setDrawerWidth(drawerWidth: string): void {
    this.drawerCollapsed = !this.drawerCollapsed;
    this.drawerWidth = drawerWidth;
  }

}
