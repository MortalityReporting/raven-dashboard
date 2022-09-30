import {Component, OnInit, ViewChild} from '@angular/core';
import {MatAccordion} from "@angular/material/expansion";
import {DocumentHandlerService} from "../../../../service/document-handler.service";
import {Comp_MDItoEDRS, Obs_CauseOfDeathPart1, Obs_CauseOfDeathPart2, Obs_DeathDate, Obs_DecedentPregnancy, Obs_MannerOfDeath, Obs_TobaccoUseContributedToDeath, USCoreLocation, USCorePatient, USCorePractitioner} from "../../../../model/mdi/profile.list"
import {ExpectedDocument} from './expected-document';
import {USCorePatientDiff} from './models/us-core-patient.diff';
import {CompositionMdiToEdrsDiff} from './models/composition-mdi-to-edrs.diff';
import {USCoreLocationDiff} from './models/us-core-location.diff';
import {ObservationTobaccoUseDiff} from './models/observation-tobacco-use.diff';
import {ObservationDecedentPregnancyDiff} from './models/observation_decedent-pregnancy.diff';
import {ObservationDeathDateDiff} from './models/observation-death-date.diff';
import {ObservationCauseOfDeathPart2Diff} from './models/observation-cause-of-death-part-2.diff';
import {ObservationMannerOfDeathDiff} from './models/observation-manner-of-death.diff';

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

  patient: USCorePatientDiff = new USCorePatientDiff();
  mdiToEdrs: CompositionMdiToEdrsDiff = new CompositionMdiToEdrsDiff();
  location: USCoreLocationDiff = new USCoreLocationDiff();
  tobaccoUse: ObservationTobaccoUseDiff = new ObservationTobaccoUseDiff();
  pregnancy: ObservationDecedentPregnancyDiff = new ObservationDecedentPregnancyDiff();
  deathDate: ObservationDeathDateDiff = new ObservationDeathDateDiff();
  causeOfDeath2: ObservationCauseOfDeathPart2Diff = new ObservationCauseOfDeathPart2Diff();
  mannerOfDeath: ObservationMannerOfDeathDiff = new ObservationMannerOfDeathDiff();

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

        this.mdiToEdrs = new CompositionMdiToEdrsDiff();
        let actualMdiToEdrs = this.documentHandler.findResourceByProfileName( actualDocument, Comp_MDItoEDRS );
        let expectedMdiToEdrs = this.documentHandler.findResourceByProfileName( this.expectedDocument, Comp_MDItoEDRS );
        this.mdiToEdrs.doDiff( actualMdiToEdrs, expectedMdiToEdrs );        

        this.location = new USCoreLocationDiff();
        let actualLocation = this.documentHandler.findResourceByProfileName( actualDocument, USCoreLocation );
        let expectedLocation = this.documentHandler.findResourceByProfileName( this.expectedDocument, USCoreLocation );
        this.location.doDiff( actualLocation, expectedLocation );
        
        this.tobaccoUse = new ObservationTobaccoUseDiff();
        let actualTobaccoUse = this.documentHandler.findResourceByProfileName( actualDocument, Obs_TobaccoUseContributedToDeath );
        let expectedTobaccoUse = this.documentHandler.findResourceByProfileName( this.expectedDocument, Obs_TobaccoUseContributedToDeath );
        this.tobaccoUse.doDiff( actualTobaccoUse, expectedTobaccoUse );

        this.pregnancy = new ObservationDecedentPregnancyDiff();
        let actualPregnancy = this.documentHandler.findResourceByProfileName( actualDocument, Obs_DecedentPregnancy );
        let expectedPregnancy = this.documentHandler.findResourceByProfileName( this.expectedDocument, Obs_DecedentPregnancy );
        this.pregnancy.doDiff( actualPregnancy, expectedPregnancy );

        let actualDeathDate = this.documentHandler.findResourceByProfileName( actualDocument, Obs_DeathDate );
        let expectedDeathDate = this.documentHandler.findResourceByProfileName( this.expectedDocument, Obs_DeathDate );
        this.deathDate.doDiff( actualDeathDate, expectedDeathDate );

        let actualCauseOfDeath1 = this.documentHandler.findResourceByProfileName( actualDocument, Obs_CauseOfDeathPart1 );
        console.log( actualCauseOfDeath1 );

        this.causeOfDeath2 = new ObservationCauseOfDeathPart2Diff();
        let actualCauseOfDeath2 = this.documentHandler.findResourceByProfileName( actualDocument, Obs_CauseOfDeathPart2 );
        let expectedCauseOfDeath2 = this.documentHandler.findResourceByProfileName( this.expectedDocument, Obs_CauseOfDeathPart2 );
        this.causeOfDeath2.doDiff( actualCauseOfDeath2, expectedCauseOfDeath2 );

        this.mannerOfDeath = new ObservationMannerOfDeathDiff();
        let actualMannerOfDeath = this.documentHandler.findResourceByProfileName( actualDocument, Obs_MannerOfDeath );
        let expectedMannerOfDeath = this.documentHandler.findResourceByProfileName( this.expectedDocument, Obs_MannerOfDeath );
        this.mannerOfDeath.doDiff( actualMannerOfDeath, expectedMannerOfDeath );
        
        this.patient = new USCorePatientDiff();
        let actualPatient = this.documentHandler.findResourceByProfileName( actualDocument, USCorePatient );
        let expectedPatient = this.documentHandler.findResourceByProfileName( this.expectedDocument, USCorePatient );  
        this.patient.doDiff( actualPatient, expectedPatient );        

        let actuaProvider = this.documentHandler.findResourceByProfileName( actualDocument, USCorePractitioner );
        console.log( actuaProvider );

      } catch(e) {
        console.log(e);
      }
    }
  }
}