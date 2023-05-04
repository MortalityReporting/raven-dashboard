import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DecedentService} from "../../services/decedent.service";
import {MdiToEdrsDocumentHandlerService} from "../../services/mdi-to-edrs-document-handler.service";
import {Observable} from "rxjs";
import {CaseHeader} from "../../models/case.header";
import {CaseSummary} from "../../models/case.summary";
import {CaseSummaryContentComponent} from "./case-summary-content/case-summary-content.component";
import {FhirHelperService} from "../../../fhir-util/services/fhir-helper.service";
import {ModuleHeaderConfig} from "../../../../../assets/configuration/module-header-config";
import {AppConfiguration} from "../../../../../assets/configuration/app-configuration";
import {ThemePalette} from "@angular/material/core";

@Component({
  selector: 'record-viewer-case-summary',
  templateUrl: './case-summary.component.html',
  styleUrls: ['../../record-viewer-styles.scss', './case-summary.component.scss']
})
export class CaseSummaryComponent implements OnInit, OnDestroy {
  @ViewChild(CaseSummaryContentComponent) caseSummaryContentComponent: CaseSummaryContentComponent;
  caseHeader$: Observable<CaseHeader>;
  caseSummary$: Observable<CaseSummary>;
  compositionId: string;
  relatedToxicology$: Observable<any>;
  toxicologyRecordList: any[];
  documentBundle$: Observable<any>;
  sidenavExpanded = false;
  autosize: boolean = false;
  selectedAuthor = "VALUE NOT FOUND";

  constructor(
    private route: ActivatedRoute,
    private decedentService: DecedentService,
    public documentHandler: MdiToEdrsDocumentHandlerService,
    private fhirHelper: FhirHelperService,
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
          const mdiCaseNumber = this.fhirHelper.getTrackingNumber(compositionSearchBundle.entry[0].resource);
          this.relatedToxicology$ = this.documentHandler.getRelatedToxicologyReports(mdiCaseNumber);
          this.relatedToxicology$.subscribe({
            next: value => {
              this.toxicologyRecordList = value
            }
          });
        }}
    );

    this.caseHeader$ = this.documentHandler.caseHeader$;
    this.caseSummary$ = this.documentHandler.caseSummary$;
  }

  onSidenavResize(expanded: boolean) {
    this.sidenavExpanded = expanded;
    this.autosize = true;
    setTimeout(() => this.autosize = false, 1);
  }

  onItemClick(id: string) {
    this.caseSummaryContentComponent.onSetState(id, true);
  }

  ngOnDestroy(): void {
    this.documentHandler.clearObservablesAndCashedData();
  }
}
