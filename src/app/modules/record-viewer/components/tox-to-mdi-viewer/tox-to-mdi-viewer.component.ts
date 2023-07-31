import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../providers/app-configuration";
import {ToxToMdiMessageHandlerService} from "../../services/tox-to-mdi-message-handler.service";
import {FhirExplorerService} from "../../../fhir-explorer/services/fhir-explorer.service";
import {ToxToMdiRecord} from "../../models/toxToMdiRecord";

@Component({
  selector: 'record-viewer-tox-to-mdi-viewer',
  templateUrl: './tox-to-mdi-viewer.component.html',
  styleUrls: ['./tox-to-mdi-viewer.component.css']
})
export class ToxToMdiViewerComponent implements OnInit {
  //@ViewChild(MdiToEdrsViewerContentComponent) contentComponent: MdiToEdrsViewerContentComponent;

  /** Inputs to children **/
  toxToMdiRecord: ToxToMdiRecord;

  drawerWidth = "30%"
  drawerCollapsed = true;

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
      console.log(record);
      this.fhirExplorerService.setSelectedFhirResource(record.messageBundle);
      this.toxToMdiRecord = record;
    });
  }

  onSidenavResize(expanded: boolean) {
    //this.sidenavExpanded = expanded;
    //this.autosize = true;
    //setTimeout(() => this.autosize = false, 1);
  }

  onItemClick(id: string) {
    // this.caseSummaryContentComponent.onSetState(id, true);
  }

  // ngOnDestroy(): void {
  //   this.documentHandler.clearObservablesAndCashedData();
  // }

  setDrawerWidth(drawerWidth: string): void {
    this.drawerCollapsed = !this.drawerCollapsed;
    this.drawerWidth = drawerWidth;
  }
}
