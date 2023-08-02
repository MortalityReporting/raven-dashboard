import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../providers/app-configuration";
import {ToxToMdiMessageHandlerService} from "../../services/tox-to-mdi-message-handler.service";
import {FhirExplorerService} from "../../../fhir-explorer/services/fhir-explorer.service";
import {ToxToMdiRecord} from "../../models/toxToMdiRecord";
import {
  MdiToEdrsViewerContentComponent
} from "../mdi-to-edrs-viewer/mdi-to-edrs-viewer-content/mdi-to-edrs-viewer-content.component";

@Component({
  selector: 'record-viewer-tox-to-mdi-viewer',
  templateUrl: './tox-to-mdi-viewer.component.html',
  styleUrls: ['./tox-to-mdi-viewer.component.css']
})
export class ToxToMdiViewerComponent implements OnInit {
  // @ViewChild(MdiToEdrsViewerContentComponent) contentComponent: MdiToEdrsViewerContentComponent;
  showFhirExplorerDrawer = false;
  showDrawer = [this.showFhirExplorerDrawer];

  /** Inputs to children **/
  toxToMdiRecord: ToxToMdiRecord;

  constructor(
    private route: ActivatedRoute,
    private toxicologyHandler: ToxToMdiMessageHandlerService,
    private fhirExplorerService: FhirExplorerService,
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration
  ) { }

  ngOnInit(): void {
    let toxLabId = this.route.snapshot.params['id'];
    this.toxicologyHandler.getRecord(toxLabId).subscribe(record => {
      this.fhirExplorerService.setSelectedFhirResource(record.messageBundle);
      this.toxToMdiRecord = record;
    });
  }

  onItemClick(id: string) {
    //this.contentComponent.onSetState(id, true);
  }


  closeAllDrawers() {
    this.showDrawer = new Array(this.showDrawer.length).fill(false);
  }

  openDrawer(index: number) {
    this.showDrawer = new Array(this.showDrawer.length).fill(false);
    this.showDrawer[index] = true;
  }
}
