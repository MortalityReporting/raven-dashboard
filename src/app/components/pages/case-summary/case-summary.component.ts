import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {DecedentService} from "../../../service/decedent.service";
import {DocumentHandlerService} from "../../../service/document-handler.service";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {map} from "rxjs-compat/operator/map";
import {CaseHeader} from "../../../model/case-summary-models/case.header";
import {CaseSummary} from "../../../model/case-summary-models/case.summary";
import {MatAccordion} from "@angular/material/expansion";
import {CaseSummaryContentComponent} from "./case-summary-content/case-summary-content.component";

@Component({
  selector: 'app-case-summary',
  templateUrl: './case-summary.component.html',
  styleUrls: ['./case-summary.component.css']
})
export class CaseSummaryComponent implements OnInit {
  @ViewChild(CaseSummaryContentComponent) caseSummaryContentComponent: CaseSummaryContentComponent;
  caseHeader$: Observable<CaseHeader>;
  caseSummary$: Observable<CaseSummary>;
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

    let subjectId = this.route.snapshot.params['id'];

    this.decedentService.getComposition(subjectId).subscribe(
      {next: (composition: any) => {
          this.documentBundle$ = this.documentHandler.getDocumentBundle(composition.entry[0].resource.id);
          this.documentBundle$.subscribe();
        }}
    );

    this.caseHeader$ = this.documentHandler.caseHeader$;
    this.caseSummary$ = this.documentHandler.caseSummary$;

    this.caseSummary$.subscribe( caseSummary => {
      caseSummary.narratives = this.documentHandler.getCurrentSubjectResource().text.div;
    })
  }
  
  onSidenavResize(expanded: boolean) {
    this.sidenavExpanded = expanded;
    this.autosize = true;
    setTimeout(() => this.autosize = false, 1);
  }

  onItemClick(id: string) {

    let shouldOpen = false;

    switch (id) {
      case "caseAdminInfo": shouldOpen = !this.caseSummaryContentComponent.caseAdminInfoExpanded; break;
      case "demographics": shouldOpen = !this.caseSummaryContentComponent.demographicsExpanded; break;
      case "circumstances": shouldOpen = !this.caseSummaryContentComponent.circumstancesExpanded; break;
      case "jurisdiction": shouldOpen = !this.caseSummaryContentComponent.jurisdictionExpanded; break;
      case "causeAndManner": shouldOpen = !this.caseSummaryContentComponent.causeAndMannerExpanded; break;
      case "medicalHistory": shouldOpen = !this.caseSummaryContentComponent.medicalHistoryExpanded; break;
      case "examNotes": shouldOpen = !this.caseSummaryContentComponent.examNotesExpanded; break;
      case "narratives": shouldOpen = !this.caseSummaryContentComponent.narrativesExpanded; break;
      case "deathCertificate": shouldOpen = !this.caseSummaryContentComponent.deathCertificateExpanded; break;
    }

    this.caseSummaryContentComponent.caseAdminInfoExpanded = false;
    this.caseSummaryContentComponent.demographicsExpanded = false;
    this.caseSummaryContentComponent.circumstancesExpanded = false;
    this.caseSummaryContentComponent.jurisdictionExpanded = false;
    this.caseSummaryContentComponent.causeAndMannerExpanded = false;
    this.caseSummaryContentComponent.medicalHistoryExpanded = false;
    this.caseSummaryContentComponent.examNotesExpanded = false;
    this.caseSummaryContentComponent.narrativesExpanded = false;
    this.caseSummaryContentComponent.deathCertificateExpanded = false;
    
    if (shouldOpen)
    {
      this.caseSummaryContentComponent.onItemClick(id);
    }
  }
}
