import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {CaseSummary} from "../../../../model/case-summary-models/case.summary";
import {CaseHeader} from "../../../../model/case-summary-models/case.header";
import {MatAccordion} from "@angular/material/expansion";

@Component({
  selector: 'app-case-comparison-content',
  templateUrl: './case-comparison-content.component.html',
  styleUrls: ['./case-comparison-content.component.css'],
})
export class CaseComparisonContentComponent implements OnInit {
  @Input() caseHeader$: Observable<CaseHeader>;
  @Input() caseSummary$: Observable<CaseSummary>;
  @Input() patientResource$: Observable<any>;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  
  caseAdminInfoExpanded: boolean = false;
  demographicsExpanded: boolean = false;
  circumstancesExpanded: boolean = false;
  jurisdictionExpanded: boolean = false;
  causeAndMannerExpanded: boolean = false;
  medicalHistoryExpanded: boolean = false;
  examNotesExpanded: boolean = false;
  narrativesExpanded: boolean = false;
  deathCertificateExpanded: boolean = false;

  patientResource: any;

  constructor() {
  }

  ngOnInit(): void {
    this.patientResource$.subscribe( patientResource => {
      this.patientResource = patientResource;
    });
  }

  jsonString( object: any ): string {   
    return JSON.stringify( object, null, 2 );
  }

  onItemClick( id: any )
  {  
    switch (id)
    {
      case 'caseAdminInfo': this.caseAdminInfoExpanded = !this.caseAdminInfoExpanded; break;      
      case 'demographics': this.demographicsExpanded = !this.demographicsExpanded; break;
      case 'circumstances':  this.circumstancesExpanded = !this.circumstancesExpanded; break;
      case 'jurisdiction': this.jurisdictionExpanded = !this.jurisdictionExpanded; break;
      case 'causeAndManner': this.causeAndMannerExpanded = !this.causeAndMannerExpanded; break;
      case 'medicalHistory': this.medicalHistoryExpanded = !this.medicalHistoryExpanded; break;
      case 'examNotes': this.examNotesExpanded = !this.examNotesExpanded; break;
      case 'narratives': this.narrativesExpanded = !this.narrativesExpanded; break;
      case 'deathCertificate': this.deathCertificateExpanded = !this.deathCertificateExpanded; break;
    }
  }
}
