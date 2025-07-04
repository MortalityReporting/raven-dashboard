import {Component, Inject, input, Input, OnInit} from '@angular/core';
import { ToxSummary } from "../../../models/tox.summary";
import { ModuleHeaderConfig } from "../../../../../providers/module-header-config";
import { AppConfiguration } from "../../../../../providers/app-configuration";
import { ToxToMdiMessageHandlerService } from "../../../services/tox-to-mdi-message-handler.service";

@Component({
    selector: 'record-viewer-tox-to-mdi-viewer-mdi-case',
    templateUrl: './tox-to-mdi-viewer-mdi-case.component.html',
    styleUrls: ['../tox-to-mdi-viewer.component.css'],
    standalone: false
})
export class ToxToMdiViewerMdiCaseComponent implements OnInit {
  @Input() toxSummary: ToxSummary;
  currentModule = input('recordViewer');
  relatedCaseAvailable = false;
  appConfiguration: AppConfiguration = AppConfiguration.config;
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
