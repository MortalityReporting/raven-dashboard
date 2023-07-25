import {Component, Inject, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {CaseHeader} from "../../../models/case.header";
import {CaseSummary} from "../../../models/case.summary";
import {ActivatedRoute} from "@angular/router";
import {DecedentService} from "../../../services/decedent.service";
import {MdiToEdrsDocumentHandlerService} from "../../../services/mdi-to-edrs-document-handler.service";
import {FhirHelperService} from "../../../../fhir-util";
import {FhirExplorerDrawerService} from "../../../../fhir-explorer/services/fhir-explorer-drawer.service";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../../providers/app-configuration";

@Component({
  selector: 'app-mdi-to-edrs-viewer-body',
  templateUrl: './mdi-to-edrs-viewer-body.component.html',
  styleUrls: ['./mdi-to-edrs-viewer-body.component.css']
})
export class MdiToEdrsViewerBodyComponent implements OnInit {
  caseHeader$: Observable<CaseHeader>;
  caseSummary$: Observable<CaseSummary>;
  compositionId: string;
  documentBundle$: Observable<any>;

  constructor(
    public documentHandler: MdiToEdrsDocumentHandlerService,
    private route: ActivatedRoute,
    private decedentService: DecedentService,
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration
  ) { }

  ngOnInit(): void {
    let subjectId = this.route.snapshot.params['id'];

    this.decedentService.getComposition(subjectId).subscribe(
      {next: (compositionSearchBundle: any) => {
          const compositionId = compositionSearchBundle.entry[0].resource.id;
          this.documentBundle$ = this.documentHandler
            .getDocumentBundle(compositionId);
          this.compositionId = compositionId;
          this.documentBundle$.subscribe();
        }}
    );
  }
}
