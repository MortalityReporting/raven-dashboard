import {Component, Inject, input, Input, OnInit, signal} from '@angular/core';
import { ToxSummary } from "../../../models/tox.summary";
import { ModuleHeaderConfig } from "../../../../../providers/module-header-config";
import { AppConfiguration } from "../../../../../providers/app-configuration";
import { ToxToMdiMessageHandlerService } from "../../../services/tox-to-mdi-message-handler.service";
import { SetFhirExplorerDirective } from '../../../../fhir-explorer/directives/set-fhir-explorer.directive';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'record-viewer-tox-to-mdi-viewer-mdi-case',
    templateUrl: './tox-to-mdi-viewer-mdi-case.component.html',
    styleUrls: ['../tox-to-mdi-viewer.component.css'],
    imports: [SetFhirExplorerDirective, MatButton, RouterLink, MatIcon]
})
export class ToxToMdiViewerMdiCaseComponent implements OnInit {
  @Input() toxSummary: ToxSummary;
  currentModule = input('recordViewer');
  relatedCaseId = '';
  isRelatedCaseAvailable =  signal<boolean>(false);
  appConfiguration: AppConfiguration = AppConfiguration.config;
  constructor(
    private toxHandler: ToxToMdiMessageHandlerService,
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration
  ) { }

  ngOnInit(): void {
    this.toxHandler.isRelatedMdiDocumentAvailable(this.toxSummary.mdiCaseNumber).subscribe(
      (result => {
        this.relatedCaseId = result?.split('/')[1];
        this.isRelatedCaseAvailable.set(this.relatedCaseId?.length > 0);
      })
    );
  }

}
