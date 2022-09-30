import {Component, OnInit, ViewChild} from '@angular/core';
import {MatAccordion} from "@angular/material/expansion";
import {DocumentHandlerService} from "../../../../service/document-handler.service";
import {USCorePatient} from "../../../../model/mdi/profile.list"
import {ExpectedDocument} from './expected-document';
import {PatientDiff} from './patient-diff';

@Component({
  selector: 'app-case-comparison-content',
  templateUrl: './case-comparison-content.component.html',
  styleUrls: ['./case-comparison-content.component.css'],
})
export class CaseComparisonContentComponent implements OnInit {
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

  patient: PatientDiff = new PatientDiff();

  expectedDocument = new ExpectedDocument().value;

  testCases = [
    {
      givenName: "Whago",
      familyName: "Brox"
    }
  ]

  _selectedTestCase = this.testCases[0];

  constructor(
    private documentHandler: DocumentHandlerService
  ) { }

  ngOnInit(): void {
  }

  selectedTestCase(): string {
    return this._selectedTestCase.givenName + " " + this._selectedTestCase.familyName;
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

  onValueChange(event: Event) {  
    const value = (event.target as any).value;

    if(value) {
      try {
        const actualDocument = JSON.parse( value );

        this.patient = new PatientDiff();

        let actualPatient = this.documentHandler.findResourceByProfileName( actualDocument, USCorePatient );
        let expectedPatient = this.documentHandler.findResourceByProfileName( this.expectedDocument, USCorePatient );  
        this.patient.doDiff( actualPatient, expectedPatient );        

      } catch(e) {
        console.log(e);
      }
    }
  }
}