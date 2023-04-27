import {Component, Inject, Input, OnInit} from '@angular/core';
import {ToxSummary} from "../../../models/tox.summary";
import {ToxicologyHandlerService} from "../../../services/toxicology-handler.service";
import {ModuleHeaderConfig} from "../../../../../../assets/configuration/module-header-config";
import {AppConfiguration} from "../../../../../../assets/configuration/app-configuration";

@Component({
  selector: 'record-viewer-toxicology-report-mdi-case',
  templateUrl: './toxicology-report-mdi-case.component.html',
  styleUrls: ['../toxicology-report.component.scss']
})
export class ToxicologyReportMdiCaseComponent implements OnInit {
  @Input() toxSummary: ToxSummary;
  relatedCaseAvailable = false;

  constructor(
    private toxHandler: ToxicologyHandlerService,
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
