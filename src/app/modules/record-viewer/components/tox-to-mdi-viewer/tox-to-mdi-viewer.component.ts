import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../providers/app-configuration";
import {ToxToMdiMessageHandlerService} from "../../services/tox-to-mdi-message-handler.service";
import {FhirExplorerService} from "../../../fhir-explorer/services/fhir-explorer.service";
import {ToxToMdiRecord} from "../../models/toxToMdiRecord";
import {ToxToMdiViewerContentComponent} from "./tox-to-mdi-viewer-content/tox-to-mdi-viewer-content.component";

@Component({
    selector: 'record-viewer-tox-to-mdi-viewer',
    templateUrl: './tox-to-mdi-viewer.component.html',
    styleUrls: ['./tox-to-mdi-viewer.component.css'],
    standalone: false
})
export class ToxToMdiViewerComponent implements OnInit {
  @ViewChild(ToxToMdiViewerContentComponent) contentComponent: ToxToMdiViewerContentComponent;
  showFhirExplorerDrawer = false;
  showDrawer = [this.showFhirExplorerDrawer];

  /** Inputs to children **/
  toxToMdiRecord: ToxToMdiRecord;
  serverErrorDetected: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private toxicologyHandler: ToxToMdiMessageHandlerService,
    private fhirExplorerService: FhirExplorerService,
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration
  ) { }

  ngOnInit(): void {
    this.serverErrorDetected = false;
    let toxLabId = this.route.snapshot.params['id'];
    this.toxicologyHandler.getRecord(toxLabId).subscribe({
      next: record => {
        this.fhirExplorerService.setSelectedFhirResource(record.messageBundle);
        this.toxToMdiRecord = record;
      },
      error: err => {
        console.error(err);
        this.serverErrorDetected = true;
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
