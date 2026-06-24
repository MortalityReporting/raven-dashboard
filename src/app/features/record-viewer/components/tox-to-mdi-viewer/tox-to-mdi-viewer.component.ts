import {Component, Inject, OnInit, signal, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../providers/app-configuration";
import {ToxToMdiMessageHandlerService} from "../../services/tox-to-mdi-message-handler.service";
import {FhirExplorerService} from "../../../fhir-explorer/services/fhir-explorer.service";
import {ToxToMdiRecord} from "../../models/toxToMdiRecord";
import {ToxToMdiViewerContentComponent} from "./tox-to-mdi-viewer-content/tox-to-mdi-viewer-content.component";
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { DecedentDisplayComponent } from '../decedent-display/decedent-display.component';
import { SetFhirExplorerDirective } from '../../../fhir-explorer/directives/set-fhir-explorer.directive';
import { ToxToMdiViewerNavMenuComponent } from './tox-to-mdi-viewer-nav-menu/tox-to-mdi-viewer-nav-menu.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FhirExplorerComponent } from '../../../fhir-explorer/components/fhir-explorer/fhir-explorer.component';

@Component({
    selector: 'record-viewer-tox-to-mdi-viewer',
    templateUrl: './tox-to-mdi-viewer.component.html',
    styleUrls: ['./tox-to-mdi-viewer.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatProgressSpinner, DecedentDisplayComponent, SetFhirExplorerDirective, ToxToMdiViewerNavMenuComponent, ToxToMdiViewerContentComponent, MatIcon, MatTooltip, FhirExplorerComponent]
})
export class ToxToMdiViewerComponent implements OnInit {
  @ViewChild(ToxToMdiViewerContentComponent) contentComponent: ToxToMdiViewerContentComponent;
  showFhirExplorerDrawer = false;
  showDrawer = [this.showFhirExplorerDrawer];

  /** Inputs to children **/
  toxToMdiRecord: ToxToMdiRecord;
  isLoading = signal(false);
  serverErrorDetected: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private toxicologyHandler: ToxToMdiMessageHandlerService,
    private fhirExplorerService: FhirExplorerService,
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration
  ) { }

  ngOnInit(): void {
    this.isLoading = signal(true);
    this.serverErrorDetected = false;
    let toxLabId = this.route.snapshot.params['id'];
    this.toxicologyHandler.getRecord(toxLabId).subscribe({
      next: record => {
        if(record?.messageBundle){
          this.fhirExplorerService.setSelectedFhirResource(record.messageBundle);
          this.toxToMdiRecord = record;
        }
        else {
          console.warn("No message bundle found")
        }
        this.isLoading.set(false);
      },
      error: err => {
        console.error(err);
        this.serverErrorDetected = true;
        this.isLoading.set(false);
      }
    });
  }

  onItemClick(id: string) {
    this.contentComponent.onSetState(id);
  }


  closeAllDrawers() {
    this.showDrawer = new Array(this.showDrawer.length).fill(false);
  }

  openDrawer(index: number) {
    this.showDrawer = new Array(this.showDrawer.length).fill(false);
    this.showDrawer[index] = true;
  }
}
