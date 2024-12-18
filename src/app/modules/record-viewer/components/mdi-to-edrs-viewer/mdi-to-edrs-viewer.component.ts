import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MdiToEdrsDocumentHandlerService} from "../../services/mdi-to-edrs-document-handler.service";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../providers/app-configuration";
import {MdiToEdrsViewerContentComponent} from "./mdi-to-edrs-viewer-content/mdi-to-edrs-viewer-content.component";
import {MdiToEdrsRecord} from "../../models/mdiToEdrsRecord";
import {FhirExplorerService} from "../../../fhir-explorer/services/fhir-explorer.service";
import {UtilsService} from "../../../../service/utils.service";

@Component({
    selector: 'record-viewer-mdi-to-edrs-viewer',
    templateUrl: './mdi-to-edrs-viewer.component.html',
    styleUrls: ['./mdi-to-edrs-viewer.component.scss'],
    standalone: false
})
export class MdiToEdrsViewerComponent implements OnInit, OnDestroy {
  @ViewChild(MdiToEdrsViewerContentComponent) contentComponent: MdiToEdrsViewerContentComponent;

  /** Inputs to children **/
  mdiToEdrsRecord: MdiToEdrsRecord;
  isLoading: boolean = false;

  documentBundle: any = {};
  compositionId: string = "";

  showFhirExplorerDrawer = false;
  showRelatedToxViewerDrawer = false;
  showDrawer = [this.showFhirExplorerDrawer, this.showRelatedToxViewerDrawer];

  currentRoute: string;


  constructor(
    private route: ActivatedRoute,
    public documentHandler: MdiToEdrsDocumentHandlerService,
    private fhirExplorerService: FhirExplorerService,
    private utilsService: UtilsService,
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration
  ) { }

  ngOnInit(): void {
    let subjectId = this.route.snapshot.params['id'];
    this.isLoading = true;
    this.documentHandler.getRecord(subjectId).subscribe({
      next: record => {
        this.fhirExplorerService.setSelectedFhirResource(record.documentBundle);
        this.mdiToEdrsRecord = record;
        this.isLoading = false;
      },
      error: err => {
        console.error(err);
        this.utilsService.showErrorMessage("Server error loading records.");
        this.isLoading = false;
      }
    });
  }

  onItemClick(id: string) {
    this.contentComponent.onSetState(id);
  }

  ngOnDestroy(): void {
    this.documentHandler.clearObservablesAndCashedData();
  }

  closeAllDrawers() {
    this.showDrawer = new Array(this.showDrawer.length).fill(false);
  }

  openDrawer(index: number) {
    this.showDrawer = new Array(this.showDrawer.length).fill(false);
    this.showDrawer[index] = true;
  }
}
