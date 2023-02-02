import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from "@angular/material/expansion";
import { DocumentHandlerService } from "../../../../service/document-handler.service";
import { USCorePatientDiff } from './models/us-core-patient.diff';
import { CompositionMdiToEdrsDiff } from './models/composition-mdi-to-edrs.diff';
import { USCoreLocationDiff } from './models/us-core-location.diff';
import { USCorePractitionerDiff } from './models/us-core-practitioner.diff';
import { ObservationTobaccoUseDiff } from './models/observation-tobacco-use.diff';
import { ObservationDecedentPregnancyDiff } from './models/observation-decedent-pregnancy.diff';
import { ObservationDeathDateDiff } from './models/observation-death-date.diff';
import { ObservationMannerOfDeathDiff } from './models/observation-manner-of-death.diff';
import { ObservationCauseOfDeathPart1Diff } from './models/observation-cause-of-death-part-1.diff';
import { ObservationCauseOfDeathPart2Diff } from './models/observation-cause-of-death-part-2.diff';
import { ObservationAutopsyPerformedDiff } from './models/observation-autopsy-performed.diff';
import { ObservationHowDeathInjuryOccurredDiff } from './models/observation-how-death-injury-occurred.diff';
import { LocationDeathDiff } from './models/location-death.diff';
import { LocationInjuryDiff } from './models/location-injury.diff';
import { DecedentService } from "../../../../service/decedent.service";
import { CaseComparisonDialogComponent } from '../case-comparison-dialog/case-comparison-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from "../../../../service/utils.service";
import { ActivatedRoute } from "@angular/router";

import {
  Comp_MDItoEDRS,
  Loc_death,
  Loc_injury,
  Obs_AutopsyPerformed,
  Obs_CauseOfDeathPart1,
  Obs_CauseOfDeathPart2,
  Obs_DeathDate,
  Obs_DecedentPregnancy,
  Obs_HowDeathInjuryOccurred,
  Obs_MannerOfDeath,
  Obs_TobaccoUseContributedToDeath,
  USCoreLocation,
  USCorePatient,
  USCorePractitioner
} from "../../../../model/mdi/profile.list"
import {FhirHelperService} from "../../../../service/fhir/fhir-helper.service";
import {BundleHelperService} from "../../../../service/fhir/bundle-helper.service";

@Component({
  selector: 'app-case-comparison-content',
  templateUrl: './case-comparison-content.component.html',
  styleUrls: ['./case-comparison-content.component.scss'],
})
export class CaseComparisonContentComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  isLoading = false;
  isAccordionExpanded = false;

  idStateList = [
    { expanded: true,     id: 'caseAdminInfo' },
    { expanded: false,    id: 'demographics' },
    { expanded: false,    id: 'jurisdiction' },
    { expanded: false,    id: 'causeAndManner' },
    { expanded: false,    id: 'medicalHistory' },
    { expanded: false,    id: 'narratives' },
    { expanded: false,    id: 'circumstances' },
    { expanded: false,    id: 'examAndAutopsy' },
  ]

  testCases = [
    {"compositionId": "9038be4e-6fcd-494a-824d-99bfd1362495", "display": "Alice Freeman"}
  ]

  patientResource: any;
  actualDocument: any = undefined;
  expectedDocument: any;
  selectedTestCase = this.testCases?.[0];
  documentBundleList: any[];

  patient: USCorePatientDiff = new USCorePatientDiff( undefined, undefined );
  mdiToEdrs: CompositionMdiToEdrsDiff = new CompositionMdiToEdrsDiff( undefined, undefined );
  location: USCoreLocationDiff = new USCoreLocationDiff( undefined, undefined );
  tobaccoUse: ObservationTobaccoUseDiff = new ObservationTobaccoUseDiff( undefined, undefined );
  pregnancy: ObservationDecedentPregnancyDiff = new ObservationDecedentPregnancyDiff( undefined, undefined );
  deathDate: ObservationDeathDateDiff;
  causeOfDeath1List: ObservationCauseOfDeathPart1Diff[] = [];
  causeOfDeath2: ObservationCauseOfDeathPart2Diff;
  mannerOfDeath: ObservationMannerOfDeathDiff;
  practitioner: USCorePractitionerDiff;
  locationDeath: LocationDeathDiff = new LocationDeathDiff( undefined, undefined );
  locationInjury: LocationInjuryDiff = new LocationInjuryDiff( undefined, undefined );
  autopsyPerformed: ObservationAutopsyPerformedDiff = new ObservationAutopsyPerformedDiff( undefined, undefined );
  howDeathOccurred: ObservationHowDeathInjuryOccurredDiff = new ObservationHowDeathInjuryOccurredDiff( undefined, undefined );

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
  howDeathOccurredStatus = 'invalid';

  constructor(
    private dialog: MatDialog,
    private decedentService: DecedentService,
    private documentHandler: DocumentHandlerService,
    private utilsService: UtilsService,
    private route: ActivatedRoute,
    private fhirHelper: FhirHelperService,
    private bundleHelper: BundleHelperService
  ) { }

  ngOnInit(): void {
    let compositionId = this.route.snapshot.params['id'];
    console.log(compositionId);

    if(compositionId){ //We need to wait for the case summary for the selected case to be loaded BEFORE we do any comparisons
      this.isLoading = true;
      this.documentHandler.getDocumentBundle(compositionId).subscribe(
        {
          next: (documentBundle: any) => {
            console.log(documentBundle)
            this.actualDocument = documentBundle
            console.log(this.actualDocument);
          }
        }
      )
      this.documentHandler.caseSummary$.subscribe({
        next: (value) => {
          this.getExpectedDocumentBundle(this.selectedTestCase.compositionId);
        },
        error: err => {
          console.error(err);
          this.utilsService.showErrorMessage();
          this.isLoading = false;
        }
      });
    }
    else { // We do comparisons with an empty record.
      this.getExpectedDocumentBundle(this.selectedTestCase.compositionId)
    }
  }

  getExpectedDocumentBundle(compositionId){
    this.isLoading = true;
    this.documentHandler.getRawDocumentBundle(compositionId).subscribe({
      next: (documentBundle: any) => {
        this.expectedDocument = documentBundle;
        this.dodiff();
        this.isLoading = false;
      },
      error: err => {
        console.error(err);
        this.utilsService.showErrorMessage();
        this.isLoading = false;
      }
    });
  }

  onExpectedCompositionChanged( event: any ) {
    this.isLoading = true;

    this.documentHandler.getRawDocumentBundle(event.value.compositionId).subscribe({
      next: (documentBundle: any) => {
        this.accordion.closeAll();
        this.isAccordionExpanded = false;
        this.expectedDocument = documentBundle;
        this.dodiff();
        this.isLoading = false;
      },
      error: err => {
        console.error(err);
        this.utilsService.showErrorMessage();
        this.isLoading = false;
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
    const dialogRef = this.dialog.open( CaseComparisonDialogComponent, {data: null}).afterClosed().subscribe( data => {
      if (data) {
        this.actualDocument = JSON.parse( data );
        this.dodiff();
        this.accordion.closeAll();
        this.isAccordionExpanded = false;
      }
    });
  }

  clearCase() {
    this.actualDocument = undefined;

    this.patient = new USCorePatientDiff( undefined, undefined );
    this.mdiToEdrs = new CompositionMdiToEdrsDiff( undefined, undefined );
    this.location = new USCoreLocationDiff( undefined, undefined );
    this.tobaccoUse = new ObservationTobaccoUseDiff( undefined, undefined );
    this.pregnancy = new ObservationDecedentPregnancyDiff( undefined, undefined );
    this.deathDate = new ObservationDeathDateDiff( undefined, undefined, undefined);
    this.causeOfDeath1List = [];
    this.causeOfDeath2 = new ObservationCauseOfDeathPart2Diff( undefined, undefined );
    this.mannerOfDeath = new ObservationMannerOfDeathDiff( undefined, undefined );
    this.practitioner = new USCorePractitionerDiff( undefined, undefined );
    this.locationDeath = new LocationDeathDiff( undefined, undefined );
    this.locationInjury = new LocationInjuryDiff( undefined, undefined );
    this.autopsyPerformed = new ObservationAutopsyPerformedDiff( undefined, undefined );
    this.howDeathOccurred = new ObservationHowDeathInjuryOccurredDiff( undefined, undefined );

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
    this.howDeathOccurredStatus = 'invalid';

    this.dodiff();
  }

  dodiff() {
    try {
      this.mdiToEdrs = new CompositionMdiToEdrsDiff(
        this.bundleHelper.findResourceByProfileName( this.actualDocument, Comp_MDItoEDRS ),
        this.bundleHelper.findResourceByProfileName( this.expectedDocument, Comp_MDItoEDRS ));

      this.location = new USCoreLocationDiff(
        this.bundleHelper.findResourceByProfileName( this.actualDocument, USCoreLocation ),
        this.bundleHelper.findResourceByProfileName( this.expectedDocument, USCoreLocation ));

      this.tobaccoUse = new ObservationTobaccoUseDiff(
        this.bundleHelper.findResourceByProfileName( this.actualDocument, Obs_TobaccoUseContributedToDeath ),
        this.bundleHelper.findResourceByProfileName( this.expectedDocument, Obs_TobaccoUseContributedToDeath ));

      this.pregnancy = new ObservationDecedentPregnancyDiff(
        this.bundleHelper.findResourceByProfileName( this.actualDocument, Obs_DecedentPregnancy ),
        this.bundleHelper.findResourceByProfileName( this.expectedDocument, Obs_DecedentPregnancy ));

      this.deathDate = new ObservationDeathDateDiff(
        this.bundleHelper.findResourceByProfileName( this.actualDocument, Obs_DeathDate ),
        this.bundleHelper.findResourceByProfileName( this.expectedDocument, Obs_DeathDate ),
        this.fhirHelper);

      this.causeOfDeath1List = [];
      let actualCauseOfDeath1List = this.bundleHelper.findResourcesByProfileName( this.actualDocument, Obs_CauseOfDeathPart1 );
      let expectedCauseOfDeath1List = this.bundleHelper.findResourcesByProfileName( this.expectedDocument, Obs_CauseOfDeathPart1 );

      this.causeAndMannerStatus = 'valid';

      if (expectedCauseOfDeath1List != undefined) {
        expectedCauseOfDeath1List.map((item: any, i) => {
          let causeOfDeath1 = undefined;
          if (actualCauseOfDeath1List != undefined && actualCauseOfDeath1List.length > i) {
            causeOfDeath1 = new ObservationCauseOfDeathPart1Diff( actualCauseOfDeath1List[i], expectedCauseOfDeath1List[i], this.fhirHelper );
          } else {
            causeOfDeath1 = new ObservationCauseOfDeathPart1Diff( null, expectedCauseOfDeath1List[i], this.fhirHelper );
          }
          this.causeOfDeath1List.push( causeOfDeath1 );
          if (causeOfDeath1.valueCodeableConcept.style === 'invalid')
          {
            this.causeAndMannerStatus = 'invalid';
          }
          if (causeOfDeath1.valueString.style === 'invalid')
          {
            this.causeAndMannerStatus = 'invalid';
          }
        })
      }

      this.causeOfDeath2 = new ObservationCauseOfDeathPart2Diff(
        this.bundleHelper.findResourceByProfileName( this.actualDocument, Obs_CauseOfDeathPart2 ),
        this.bundleHelper.findResourceByProfileName( this.expectedDocument, Obs_CauseOfDeathPart2 ));

      this.mannerOfDeath = new ObservationMannerOfDeathDiff(
        this.bundleHelper.findResourceByProfileName( this.actualDocument, Obs_MannerOfDeath ),
        this.bundleHelper.findResourceByProfileName( this.expectedDocument, Obs_MannerOfDeath ));

      this.locationDeath = new LocationDeathDiff(
        this.bundleHelper.findResourceByProfileName( this.actualDocument, Loc_death ),
        this.bundleHelper.findResourceByProfileName( this.expectedDocument, Loc_death ));

      this.locationInjury = new LocationInjuryDiff(
        this.bundleHelper.findResourceByProfileName( this.actualDocument, Loc_injury ),
        this.bundleHelper.findResourceByProfileName( this.expectedDocument, Loc_injury ));

      this.patient = new USCorePatientDiff(
        this.bundleHelper.findResourceByProfileName( this.actualDocument, USCorePatient ),
        this.bundleHelper.findResourceByProfileName( this.expectedDocument, USCorePatient ));

      this.practitioner = new USCorePractitionerDiff(
        this.bundleHelper.findResourceByProfileName( this.actualDocument, USCorePractitioner ),
        this.bundleHelper.findResourceByProfileName( this.expectedDocument, USCorePractitioner ));

      this.autopsyPerformed = new ObservationAutopsyPerformedDiff(
        this.bundleHelper.findResourceByProfileName( this.actualDocument, Obs_AutopsyPerformed ),
        this.bundleHelper.findResourceByProfileName( this.expectedDocument, Obs_AutopsyPerformed ));

      this.howDeathOccurred = new ObservationHowDeathInjuryOccurredDiff(
        this.bundleHelper.findResourceByProfileName( this.actualDocument, Obs_HowDeathInjuryOccurred ),
        this.bundleHelper.findResourceByProfileName( this.expectedDocument, Obs_HowDeathInjuryOccurred ));

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
        this.patient.identifier.style === 'valid' &&
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

      this.causeAndMannerStatus = (
        this.causeAndMannerStatus === 'valid' &&
        this.howDeathOccurred.placeOfInjury.style === 'valid' &&
        this.howDeathOccurred.howDeathInjuryOccurred.style === 'valid' &&
        this.howDeathOccurred.effectiveDateTime.style === 'valid' &&
        this.howDeathOccurred.injuryOccurredAtWork.style === 'valid' &&
        this.howDeathOccurred.transportationRole.style === 'valid'
      ) ? 'valid' : 'invalid';

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

  isExpanded(elementId: string) {
    return this.idStateList.find(element => element.id == elementId)?.expanded;
  }

  onToggleState(id: any ) {
    this.idStateList = this.idStateList.map(element => element.id == id ? {id: element.id, expanded: !element.expanded}: element);
  }

  onSetState(resourceId, state){
    this.idStateList = this.idStateList.map(element => element.id == resourceId ? {id: element.id, expanded: state} : element);
  }

  onOpenAll() {
    this.idStateList.forEach(element => element.expanded = true);
    this.accordion.openAll()
  }

  onCloseAll() {
    this.idStateList.forEach(element => element.expanded = false);
    this.accordion.closeAll()
  }
}
