import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {CaseSummary} from "../../../../model/case-summary-models/case.summary";
import {Author, CaseHeader} from "../../../../model/case-summary-models/case.header";
import {MatAccordion} from "@angular/material/expansion";
import {Profiles} from "../../../../model/mdi/profile.list";

@Component({
  selector: 'app-case-summary-content',
  templateUrl: './case-summary-content.component.html',
  styleUrls: ['./case-summary-content.component.css'],
})
export class CaseSummaryContentComponent implements OnInit {
  @Input() caseHeader$: Observable<CaseHeader>;
  @Input() caseSummary$: Observable<CaseSummary>;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  
  line1: string;
  line2: string;
  line3: string;

  caseAdminInfoExpanded: boolean = true;
  demographicsExpanded: boolean = false;
  circumstancesExpanded: boolean = false;
  jurisdictionExpanded: boolean = false;
  causeAndMannerExpanded: boolean = false;
  medicalHistoryExpanded: boolean = false;
  examNotesExpanded: boolean = false;
  narrativesExpanded: boolean = false;
  deathCertificateExpanded: boolean = false;

  profiles: any = Profiles;
  ids = ["ID-1", "ID-2", "ID-3"];
  selectedId = "ID-1";

  constructor() {
  }

  ngOnInit(): void {

    this.caseHeader$.subscribe( caseHeader => {

      if (caseHeader.authors != null)
      {
        let author = caseHeader.authors[0];
        
        this.line1 = author.givenName + " " + author.familyName + "  License #: " + author.license + " Phone #: " + author.phoneNumber;
        this.line2 = author.line;
        this.line3 = author.city + ", " + author.state + "  " + author.postalCode;
      }
    });
  }

  onItemClick( id: any )
  {  
    switch  (id)
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

  onOpenAll() {
    this.caseAdminInfoExpanded = true;
    this.demographicsExpanded = true;
    this.circumstancesExpanded = true;
    this.jurisdictionExpanded = true;
    this.causeAndMannerExpanded = true;
    this.medicalHistoryExpanded = true;
    this.examNotesExpanded = true;
    this.narrativesExpanded = true;
    this.deathCertificateExpanded = true;

    this.accordion.openAll()    
  }

  onCloseAll() {
    this.caseAdminInfoExpanded = false;
    this.demographicsExpanded= false;
    this.circumstancesExpanded = false;
    this.jurisdictionExpanded = true;
    this.causeAndMannerExpanded = false;
    this.medicalHistoryExpanded = false;
    this.examNotesExpanded = false;
    this.narrativesExpanded = false;
    this.deathCertificateExpanded = false;

    this.accordion.closeAll()
  }
}
