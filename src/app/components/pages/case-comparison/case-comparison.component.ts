import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {DecedentService} from "../../../modules/record-viewer/services/decedent.service";
import {DocumentHandlerService} from "../../../modules/record-viewer/services/document-handler.service";
import { Observable } from "rxjs";
import {CaseHeader} from "../../../modules/record-viewer/models/case.header";
import {CaseSummary} from "../../../modules/record-viewer/models/case.summary";
import {CaseComparisonContentComponent} from "./case-comparison-content/case-comparison-content.component";

@Component({
  selector: 'app-case-comparison',
  templateUrl: './case-comparison.component.html',
  styleUrls: ['./case-comparison.component.scss']
})
export class CaseComparisonComponent implements OnInit, OnDestroy {
  @ViewChild(CaseComparisonContentComponent) caseComparisonContentComponent: CaseComparisonContentComponent;
  caseHeader$: Observable<CaseHeader>;
  caseSummary$: Observable<CaseSummary>;
  patientResource$: Observable<any>;
  documentBundle$: Observable<any>;
  sidenavExpanded = false;
  autosize: boolean = false;
  selectedAuthor = "VALUE NOT FOUND";

  constructor(
    private route: ActivatedRoute,
    private decedentService: DecedentService,
    public documentHandler: DocumentHandlerService
  ) { }

  ngOnInit(): void {

    // let compositionId = this.route.snapshot.params['id'];
    // if (compositionId) {
    //
    //   this.documentBundle$ = this.documentHandler.getDocumentBundle(compositionId);
    //   this.documentBundle$.subscribe();
    //   // this.caseHeader$ = this.documentHandler.caseHeader$;
    //   // this.caseSummary$ = this.documentHandler.caseSummary$;
    //   this.patientResource$ = this.documentHandler.patientResource$;
    //   // this.caseSummary$.subscribe(caseSummary => {
    //   //   caseSummary.narratives = this.documentHandler.getCurrentSubjectResource()?.text?.div;
    //   // })
    // }
  }

  onSidenavResize(expanded: boolean) {
    this.sidenavExpanded = expanded;
    this.autosize = true;
    setTimeout(() => this.autosize = false, 1);
  }

  onItemClick(id: string) {
    this.caseComparisonContentComponent.onSetState(id, true)
  }

  ngOnDestroy(): void {
    this.documentHandler.clearObservablesAndCashedData();
  }
}
