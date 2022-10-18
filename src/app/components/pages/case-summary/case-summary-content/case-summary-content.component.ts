import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {CaseSummary} from "../../../../model/case-summary-models/case.summary";
import {Author, CaseHeader} from "../../../../model/case-summary-models/case.header";
import {MatAccordion} from "@angular/material/expansion";
import {Profiles} from "../../../../model/mdi/profile.list";
import {FhirResourceProviderService} from "../../../../service/fhir-resource-provider.service";

@Component({
  selector: 'app-case-summary-content',
  templateUrl: './case-summary-content.component.html',
  styleUrls: ['./case-summary-content.component.css'],
})
export class CaseSummaryContentComponent implements OnInit {
  @Input() caseHeader$: Observable<CaseHeader>;
  @Input() caseSummary$: Observable<CaseSummary>;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  name: string = "VALUE NOT FOUND";
  licence: string = "VALUE NOT FOUND";
  phone:string = "VALUE NOT FOUND";
  addressLine: string = "VALUE NOT FOUND";

  caseAdminInfoExpanded: boolean = true;
  demographicsExpanded: boolean = false;
  circumstancesExpanded: boolean = false;
  jurisdictionExpanded: boolean = false;
  causeAndMannerExpanded: boolean = false;
  medicalHistoryExpanded: boolean = false;
  examNotesExpanded: boolean = false;
  narrativesExpanded: boolean = false;

  profiles: any = Profiles;
  ids = ["ID-1", "ID-2", "ID-3"];
  selectedId = "ID-1";

  author: any;

  constructor(
    private fhirResourceProviderService: FhirResourceProviderService
  ) {
  }

  ngOnInit(): void {

    this.caseHeader$.subscribe( caseHeader => {
      console.log(caseHeader);
      if (caseHeader.authors != null)
      {
        let author = caseHeader.authors[0];
        this.author = caseHeader.authors[0];
        this.name = `${this.author.givenName[0] ?? ''} ${this.author.familyName ?? ''}`;
        this.licence = this.author.license ?? '';
        this.phone = this.author.phoneNumber ?? '';
        this.addressLine = `${author.line}\n${this.author.city ? this.author.city + ', ' : ''} ${this.author.state ?? ''} ${this.author.postalCode ?? ''}`
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

    this.accordion.closeAll()
  }

  onNotImplementedItemSelected() {
    this.fhirResourceProviderService.setSelectedFhirResource(null);
  }

  onAuthorSelected() {
    if(this.author){
      this.fhirResourceProviderService.setSelectedFhirResource(this.author);
    }
  }
}
