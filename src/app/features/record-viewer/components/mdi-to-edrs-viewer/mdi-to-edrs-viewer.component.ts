import {Component, Inject, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MdiToEdrsDocumentHandlerService} from "../../services/mdi-to-edrs-document-handler.service";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../providers/app-configuration";
import {MdiToEdrsViewerContentComponent} from "./mdi-to-edrs-viewer-content/mdi-to-edrs-viewer-content.component";
import {MdiToEdrsRecord} from "../../models/mdiToEdrsRecord";
import {FhirExplorerService} from "../../../fhir-explorer/services/fhir-explorer.service";
import {UtilsService} from "../../../../service/utils.service";
import { DecedentDisplayComponent } from '../decedent-display/decedent-display.component';
import { SetFhirExplorerDirective } from '../../../fhir-explorer/directives/set-fhir-explorer.directive';
import { MdiToEdrsViewerNavMenuComponent } from './mdi-to-edrs-viewer-nav-menu/mdi-to-edrs-viewer-nav-menu.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FhirExplorerComponent } from '../../../fhir-explorer/components/fhir-explorer/fhir-explorer.component';
import { MdiToEdrsViewerRelatedToxComponent } from './mdi-to-edrs-viewer-related-tox/mdi-to-edrs-viewer-related-tox.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'record-viewer-mdi-to-edrs-viewer',
    templateUrl: './mdi-to-edrs-viewer.component.html',
    styleUrls: ['./mdi-to-edrs-viewer.component.scss'],
    imports: [DecedentDisplayComponent, SetFhirExplorerDirective, MdiToEdrsViewerNavMenuComponent, MdiToEdrsViewerContentComponent, MatIcon, MatTooltip, FhirExplorerComponent, MdiToEdrsViewerRelatedToxComponent, MatProgressSpinner]
})
export class MdiToEdrsViewerComponent implements OnInit, OnDestroy {
  @ViewChild(MdiToEdrsViewerContentComponent) contentComponent: MdiToEdrsViewerContentComponent;

  /** Inputs to children **/
  mdiToEdrsRecord: MdiToEdrsRecord;
  isLoading = signal(false);

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
    this.isLoading.set(true);
    this.documentHandler.getRecord(subjectId).subscribe({
      next: record => {
        this.fhirExplorerService.setSelectedFhirResource(record.documentBundle);
        this.mdiToEdrsRecord = record;
        this.isLoading.set(false);
      },
      error: err => {
        console.error(err);
        this.utilsService.showErrorMessage("Server error loading records.");
        this.isLoading.set(false);
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
