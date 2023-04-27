import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ToxicologyHandlerService} from "../../services/toxicology-handler.service";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {ToxHeader} from "../../models/tox.header";
import {ToxSummary} from "../../models/tox.summary";
import {ToxicologyReportContentComponent} from "./toxicology-report-content/toxicology-report-content.component";
import {ModuleHeaderConfig} from "../../../../../assets/configuration/module-header-config";
import {AppConfiguration} from "../../../../../assets/configuration/app-configuration";
import {FhirExplorerService} from "../../../fhir-explorer/services/fhir-explorer.service";

@Component({
  selector: 'record-viewer-toxicology-report',
  templateUrl: './toxicology-report.component.html',
  styleUrls: ['../../record-viewer-styles.scss', './toxicology-report.component.scss']
})
export class ToxicologyReportComponent implements OnInit {
  @ViewChild(ToxicologyReportContentComponent) toxReportContentComponent: ToxicologyReportContentComponent;

  messageBundle$: Observable<any>;
  toxHeader: ToxHeader;
  toxSummary: ToxSummary;

  sidenavExpanded = true;
  autosize: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private toxicologyHandler: ToxicologyHandlerService,
    private fhirExplorerService: FhirExplorerService,
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration
  ) {}

  ngOnInit(): void {
    let toxLabId = this.route.snapshot.params['id'];
    this.messageBundle$ = this.toxicologyHandler.getMessageBundle(toxLabId);
    this.messageBundle$.subscribe(bundle => {
      this.fhirExplorerService.setSelectedFhirResource(bundle);
      this.toxHeader = this.toxicologyHandler.constructToxHeaderHeader(bundle);
      this.toxSummary = this.toxicologyHandler.constructToxSummary(bundle);
      }
    );
  }

  onSidenavResize(expanded: boolean) {
    this.sidenavExpanded = expanded;
    this.autosize = true;
    setTimeout(() => this.autosize = false, 1);
  }

  onItemClick(id: string) {
    this.toxReportContentComponent.onSetState(id, true);
  }
}
