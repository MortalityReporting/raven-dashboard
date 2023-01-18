import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DecedentService} from "../../../service/decedent.service";
import {DocumentHandlerService} from "../../../service/document-handler.service";
import {Observable} from "rxjs";
import {CaseHeader} from "../../../model/record-models/case.header";
import {CaseSummary} from "../../../model/record-models/case.summary";
import {CaseSummaryContentComponent} from "./case-summary-content/case-summary-content.component";
import {FhirHelperService} from "../../../service/fhir/fhir-helper.service";
import {map} from "rxjs-compat/operator/map";

@Component({
  selector: 'app-case-summary',
  templateUrl: './case-summary.component.html',
  styleUrls: ['./case-summary.component.css']
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
    public documentHandler: DocumentHandlerService,
    private fhirHelper: FhirHelperService
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
              console.log(value);
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
