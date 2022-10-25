import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from "@angular/material/expansion";
import { DocumentHandlerService } from "../../../../service/document-handler.service";
import { USCorePatientDiff } from './models/us-core-patient.diff';
import { CompositionMdiToEdrsDiff } from './models/composition-mdi-to-edrs.diff';
import { USCoreLocationDiff } from './models/us-core-location.diff';
import { ObservationTobaccoUseDiff } from './models/observation-tobacco-use.diff';
import { ObservationDecedentPregnancyDiff } from './models/observation_decedent-pregnancy.diff';
import { ObservationDeathDateDiff } from './models/observation-death-date.diff';
import { ObservationMannerOfDeathDiff } from './models/observation-manner-of-death.diff';
import { USCorePractitionerDiff } from './models/us-core-practitioner.diff';
import { ObservationCauseOfDeathPart1Diff } from './models/observation-cause-of-death-part-1.diff';
import { ObservationCauseOfDeathPart2Diff } from './models/observation-cause-of-death-part-2.diff';
import { LocationDeathDiff } from './models/location-death.diff';
import { LocationInjuryDiff } from './models/location-injury.diff';
import { DecedentService } from "../../../../service/decedent.service";
import { CaseComparisonDialogComponent } from '../case-comparison-dialog/case-comparison-dialog.component';
import { MatDialog } from '@angular/material/dialog';

import {
  Comp_MDItoEDRS,
  Loc_death,
  Loc_injury,
  Obs_AutopsyPerformed,
  Obs_CauseOfDeathPart1,
  Obs_CauseOfDeathPart2,
  Obs_DeathDate,
  Obs_DecedentPregnancy,
  Obs_MannerOfDeath,
  Obs_TobaccoUseContributedToDeath,
  USCoreLocation,
  USCorePatient,
  USCorePractitioner
} from "../../../../model/mdi/profile.list"
import { ObservationAutopsyPerformedDiff } from './models/observation_autopsy_performed.diff';
import {UtilsService} from "../../../../service/utils.service";

@Component({
  selector: 'app-case-comparison-content',
  templateUrl: './case-comparison-content.component.html',
  styleUrls: ['./case-comparison-content.component.css'],
})
export class CaseComparisonContentComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  isLoading = false;
  isAccordionExpanded = false;

  testCases = [
    {"compositionId": "4b81ded1-6dc2-43ab-94b4-35b278c3e75f", "display": "Alice FREEMAN"},
    {"compositionId": "ff3563ad-0d8b-4bc3-8e69-5ae900222534", "display": "Whago C Brox"},
  ]

  patientResource: any;
  actualDocument: any = undefined;
  expectedDocument: any;
  selectedTestCase = this.testCases[0];
  documentBundleList: any[];


  caseAdminInfoExpanded: boolean = false;
  demographicsExpanded: boolean = false;
  circumstancesExpanded: boolean = false;
  jurisdictionExpanded: boolean = false;
  causeAndMannerExpanded: boolean = false;
  examNotesExpanded: boolean = false;

  patient: USCorePatientDiff = new USCorePatientDiff( undefined, undefined );
  mdiToEdrs: CompositionMdiToEdrsDiff = new CompositionMdiToEdrsDiff( undefined, undefined );
  location: USCoreLocationDiff = new USCoreLocationDiff( undefined, undefined );
  tobaccoUse: ObservationTobaccoUseDiff = new ObservationTobaccoUseDiff( undefined, undefined );
  pregnancy: ObservationDecedentPregnancyDiff = new ObservationDecedentPregnancyDiff( undefined, undefined );
  deathDate: ObservationDeathDateDiff = new ObservationDeathDateDiff( undefined, undefined, undefined );
  causeOfDeath1List: ObservationCauseOfDeathPart1Diff[] = [];
  causeOfDeath2: ObservationCauseOfDeathPart2Diff = new ObservationCauseOfDeathPart2Diff( undefined, undefined );
  mannerOfDeath: ObservationMannerOfDeathDiff = new ObservationMannerOfDeathDiff( undefined, undefined );
  practitioner: USCorePractitionerDiff = new USCorePractitionerDiff( undefined, undefined );
  locationDeath: LocationDeathDiff = new LocationDeathDiff( undefined, undefined );
  locationInjury: LocationInjuryDiff = new LocationInjuryDiff( undefined, undefined );
  autopsyPerformed: ObservationAutopsyPerformedDiff = new ObservationAutopsyPerformedDiff( undefined, undefined );

  demographicsStatus = 'invalid';
  circumstancesStatus = 'invalid';
  caseAdminInfoStatus = 'invalid';
  jurisdictionStatus = 'invalid';
  causeAndMannerStatus = 'invalid';
  medicalHistoryStatus = 'invalid';
  examAndHistoryStatus = 'invalid';
  narrativesStatus = 'invalid';
  deathDateStatus = 'invalid';
  examAndAutopsyStatus = 'invalid';

  constructor(
    private dialog: MatDialog,
    private decedentService: DecedentService,
    private documentHandler: DocumentHandlerService,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;

    this.decedentService.getMockResponse().subscribe({
      next: value => {
        console.log(value);
        //this.documentBundleList = value.entry.map(element => element.display = element.entry.)
      }
    });

    this.decedentService.getDocumentBundle(this.selectedTestCase.compositionId).subscribe({
      next: (documentBundle: any) => {
        this.expectedDocument = documentBundle;
        this.dodiff();
        this.isLoading = false;
      },
      error: err => {
        console.error(err);
        this.utilsService.showErrorMessage();
      }
    });
  }

  onExpectedCompositionChanged( event: any ) {
    this.isLoading = true;

    this.decedentService.getDocumentBundle(event.value).subscribe({
      next: (documentBundle: any) => {
        this.expectedDocument = documentBundle;
        this.dodiff();
        this.isLoading = false;
        this.accordion.closeAll();
        this.isAccordionExpanded = false;
        console.log('this.accordion.closeAll()')
      },
      error: err => {
        console.error(err);
        this.utilsService.showErrorMessage();
      },
    });
  }

  onActualCompositionChanged(event: Event) {
    try {
      this.actualDocument = JSON.parse( (event.target as any).value );
      this.dodiff();
    } catch(e) {
      console.log(e);
    }
  }

  onInputBundleClick() {
    const dialogRef = this.dialog.open( CaseComparisonDialogComponent, {data: this.actualDocument}).afterClosed().subscribe( data => {
      if (data === undefined) {
        this.clearCase();
      } else {
        this.actualDocument = JSON.parse( data );
          this.dodiff();
      }
    });
  }

  onItemClick( id: any ) {
    switch (id) {
      case 'caseAdminInfo': this.caseAdminInfoExpanded = !this.caseAdminInfoExpanded; break;
      case 'demographics': this.demographicsExpanded = !this.demographicsExpanded; break;
      case 'circumstances':  this.circumstancesExpanded = !this.circumstancesExpanded; break;
      case 'jurisdiction': this.jurisdictionExpanded = !this.jurisdictionExpanded; break;
      case 'causeAndManner': this.causeAndMannerExpanded = !this.causeAndMannerExpanded; break;
      case 'examNotes': this.examNotesExpanded = !this.examNotesExpanded; break;
    }
  }

  clearCase() {
    this.actualDocument = undefined;

    this.patient = new USCorePatientDiff( undefined, undefined );
    this.mdiToEdrs = new CompositionMdiToEdrsDiff( undefined, undefined );
    this.location = new USCoreLocationDiff( undefined, undefined );
    this.tobaccoUse = new ObservationTobaccoUseDiff( undefined, undefined );
    this.pregnancy = new ObservationDecedentPregnancyDiff( undefined, undefined );
    this.deathDate = new ObservationDeathDateDiff( undefined, undefined, undefined );
    this.causeOfDeath1List = [];
    this.causeOfDeath2 = new ObservationCauseOfDeathPart2Diff( undefined, undefined );
    this.mannerOfDeath = new ObservationMannerOfDeathDiff( undefined, undefined );
    this.practitioner = new USCorePractitionerDiff( undefined, undefined );
    this.locationDeath = new LocationDeathDiff( undefined, undefined );
    this.locationInjury = new LocationInjuryDiff( undefined, undefined );
    this.autopsyPerformed = new ObservationAutopsyPerformedDiff( undefined, undefined );

    this.demographicsStatus = 'invalid';
    this.circumstancesStatus = 'invalid';
    this.caseAdminInfoStatus = 'invalid';
    this.jurisdictionStatus = 'invalid';
    this.causeAndMannerStatus = 'invalid';
    this.medicalHistoryStatus = 'invalid';
    this.examAndHistoryStatus = 'invalid';
    this.narrativesStatus = 'invalid';
    this.deathDateStatus = 'invalid';
    this.deathDateStatus = 'invalid';
    this.examAndAutopsyStatus = 'invalid';

    this.dodiff();
  }

  dodiff() {
    try {
      this.mdiToEdrs = new CompositionMdiToEdrsDiff(
        this.documentHandler.findResourceByProfileName( this.actualDocument, Comp_MDItoEDRS ),
        this.documentHandler.findResourceByProfileName( this.expectedDocument, Comp_MDItoEDRS ));

      this.location = new USCoreLocationDiff(
        this.documentHandler.findResourceByProfileName( this.actualDocument, USCoreLocation ),
        this.documentHandler.findResourceByProfileName( this.expectedDocument, USCoreLocation ));

      this.tobaccoUse = new ObservationTobaccoUseDiff(
        this.documentHandler.findResourceByProfileName( this.actualDocument, Obs_TobaccoUseContributedToDeath ),
        this.documentHandler.findResourceByProfileName( this.expectedDocument, Obs_TobaccoUseContributedToDeath ));

      this.pregnancy = new ObservationDecedentPregnancyDiff(
        this.documentHandler.findResourceByProfileName( this.actualDocument, Obs_DecedentPregnancy ),
        this.documentHandler.findResourceByProfileName( this.expectedDocument, Obs_DecedentPregnancy ));

      this.deathDate = new ObservationDeathDateDiff(
        this.documentHandler.findResourceByProfileName( this.actualDocument, Obs_DeathDate ),
        this.documentHandler.findResourceByProfileName( this.expectedDocument, Obs_DeathDate ),
        this.documentHandler);

      this.causeOfDeath1List = [];
      let actualCauseOfDeath1List = this.documentHandler.findResourcesByProfileName( this.actualDocument, Obs_CauseOfDeathPart1 );
      let expectedCauseOfDeath1List = this.documentHandler.findResourcesByProfileName( this.expectedDocument, Obs_CauseOfDeathPart1 );

      if (actualCauseOfDeath1List != undefined) {
        for (let i = 0; i < actualCauseOfDeath1List.length; i++) {
          let causeOfDeath1 = new ObservationCauseOfDeathPart1Diff( actualCauseOfDeath1List[i], expectedCauseOfDeath1List[i] );
          this.causeOfDeath1List.push( causeOfDeath1 );
        }
      }

      this.causeOfDeath2 = new ObservationCauseOfDeathPart2Diff(
        this.documentHandler.findResourceByProfileName( this.actualDocument, Obs_CauseOfDeathPart2 ),
        this.documentHandler.findResourceByProfileName( this.expectedDocument, Obs_CauseOfDeathPart2 ));

      this.mannerOfDeath = new ObservationMannerOfDeathDiff(
        this.documentHandler.findResourceByProfileName( this.actualDocument, Obs_MannerOfDeath ),
        this.documentHandler.findResourceByProfileName( this.expectedDocument, Obs_MannerOfDeath ));

      this.locationDeath = new LocationDeathDiff(
        this.documentHandler.findResourceByProfileName( this.actualDocument, Loc_death ),
        this.documentHandler.findResourceByProfileName( this.expectedDocument, Loc_death ));

      this.locationInjury = new LocationInjuryDiff(
        this.documentHandler.findResourceByProfileName( this.actualDocument, Loc_injury ),
        this.documentHandler.findResourceByProfileName( this.expectedDocument, Loc_injury ));

      this.patient = new USCorePatientDiff(
        this.documentHandler.findResourceByProfileName( this.actualDocument, USCorePatient ),
        this.documentHandler.findResourceByProfileName( this.expectedDocument, USCorePatient ));

      this.practitioner = new USCorePractitionerDiff(
        this.documentHandler.findResourceByProfileName( this.actualDocument, USCorePractitioner ),
        this.documentHandler.findResourceByProfileName( this.expectedDocument, USCorePractitioner ));

      this.autopsyPerformed = new ObservationAutopsyPerformedDiff(
        this.documentHandler.findResourceByProfileName( this.actualDocument, Obs_AutopsyPerformed ),
        this.documentHandler.findResourceByProfileName( this.expectedDocument, Obs_AutopsyPerformed ));

      this.caseAdminInfoStatus = (
        this.mdiToEdrs.extension.style === 'valid' &&
        this.practitioner.name.style === 'valid' &&
        this.practitioner.identifier.style === 'valid' &&
        this.practitioner.telecom.style === 'valid' &&
        this.practitioner.address.style === 'valid'
      ) ? 'valid' : 'invalid';

      this.demographicsStatus = (
        this.patient.name.style === 'valid' &&
        this.patient.gender.style === 'valid' &&
        this.patient.birthDate.style === 'valid' &&
        this.patient.ethnicity.style === 'valid' &&
        this.patient.race.style === 'valid' &&
        this.patient.address.style === 'valid'
      ) ? 'valid' : 'invalid';

      this.circumstancesStatus = (
        this.locationDeath.name.style === 'valid' &&
        this.locationInjury.name.style === 'valid' &&
        this.tobaccoUse.valueCodeableConcept.style === 'valid' &&
        this.pregnancy.valueCodeableConcept.style === 'valid'
      ) ? 'valid' : 'invalid';

      this.jurisdictionStatus = (
        this.deathDate.pronouncedDateTime.style === 'valid' &&
        this.deathDate.effectiveDateTime.style === 'valid' &&
        this.deathDate.method.style === 'valid'
      ) ? 'valid' : 'invalid';

      this.examAndAutopsyStatus = (
        this.autopsyPerformed.valueCodeableConcept.style === 'valid' &&
        this.autopsyPerformed.componentValueCodeableConcept.style === 'valid'
      ) ? 'valid' : 'invalid';

      this.causeAndMannerStatus = 'valid';

      if (actualCauseOfDeath1List != undefined) {
        for (let i = 0; i < actualCauseOfDeath1List.length; i++) {
          let causeOfDeath1 = new ObservationCauseOfDeathPart1Diff( actualCauseOfDeath1List[i], expectedCauseOfDeath1List[i] );
          if (causeOfDeath1.valueCodeableConcept.style === 'invalid')
          {
            this.causeAndMannerStatus = 'invalid';
          }
          if (causeOfDeath1.component.style === 'invalid')
          {
            this.causeAndMannerStatus = 'invalid';
          }
        }
      }

      if (this.causeOfDeath2.valueCodeableConcept.style === 'invalid' )
      {
        this.causeAndMannerStatus = 'invalid';
      }

      if (this.mannerOfDeath.valueCodeableConcept.style === 'invalid' )
      {
        this.causeAndMannerStatus = 'invalid';
      }

    } catch(e) {
      console.log(e);
    }
  }

  onOpenAll() {
    this.accordion.openAll();
    this.isAccordionExpanded = true;
  }

  onCloseAll() {
    this.accordion.closeAll();
    this.isAccordionExpanded = false;
  }
}
