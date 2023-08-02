import {Component, Inject, Input, OnInit} from '@angular/core';
import { ToxSummary } from "../../../models/tox.summary";
import { ModuleHeaderConfig } from "../../../../../providers/module-header-config";
import { AppConfiguration } from "../../../../../providers/app-configuration";
import { ToxToMdiMessageHandlerService } from "../../../services/tox-to-mdi-message-handler.service";

@Component({
  selector: 'record-viewer-toxicology-report-mdi-case',
  templateUrl: './toxicology-report-mdi-case.component.html',
  styleUrls: ['../../tox-to-mdi/toxicology-report.component.scss']
})
export class ToxicologyReportMdiCaseComponent implements OnInit {
  @Input() toxSummary: ToxSummary;
  relatedCaseAvailable = false;

  constructor(
    private toxHandler: ToxToMdiMessageHandlerService,
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration
  ) { }

  ngOnInit(): void {
    this.toxHandler.isRelatedMdiDocumentAvailable(this.toxSummary.mdiCaseNumber).subscribe(
      (result => {
        this.relatedCaseAvailable = result?.split('/')[1];
      })
    );
  }

}
