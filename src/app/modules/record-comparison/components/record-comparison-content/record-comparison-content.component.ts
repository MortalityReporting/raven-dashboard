import {Component, inject, OnInit, ViewChild} from '@angular/core';
import { MatAccordion } from "@angular/material/expansion";
import { DocumentHandlerService } from "../../../record-viewer/services/document-handler.service";
import { USCorePatientDiff } from '../../models/us-core-patient.diff';
import { CompositionMdiToEdrsDiff } from '../../models/composition-mdi-to-edrs.diff';
import { USCoreLocationDiff } from '../../models/us-core-location.diff';
import { USCorePractitionerDiff } from '../../models/us-core-practitioner.diff';
import { ObservationTobaccoUseDiff } from '../../models/observation-tobacco-use.diff';
import { ObservationDecedentPregnancyDiff } from '../../models/observation-decedent-pregnancy.diff';
import { ObservationDeathDateDiff } from '../../models/observation-death-date.diff';
import { ObservationMannerOfDeathDiff } from '../../models/observation-manner-of-death.diff';
import { ObservationCauseOfDeathPart1Diff } from '../../models/observation-cause-of-death-part-1.diff';
import { ObservationCauseOfDeathPart2Diff } from '../../models/observation-cause-of-death-part-2.diff';
import { ObservationAutopsyPerformedDiff } from '../../models/observation-autopsy-performed.diff';
import { ObservationHowDeathInjuryOccurredDiff } from '../../models/observation-how-death-injury-occurred.diff';
import { LocationDeathDiff } from '../../models/location-death.diff';
import { LocationInjuryDiff } from '../../models/location-injury.diff';
import { DecedentService } from "../../../record-viewer/services/decedent.service";
import { RecordComparisonDialogComponent } from '../record-comparison-dialog/record-comparison-dialog.component';
import { UtilsService } from "../../../../service/utils.service";
import { ActivatedRoute } from "@angular/router";
import {FhirHelperService} from "../../../fhir-util/services/fhir-helper.service";
import {BundleHelperService} from "../../../fhir-util/services/bundle-helper.service";
import {UserDocumentService} from "../../services/user-document.service";
import {MdiToEDRSDocumentWrapper} from "../../models/mdiToEdrsDocumentWrapper";
import {ReferenceDocumentService} from "../../services/reference-document.service";
import {ComparisonService} from "../../services/comparison.service";
import {Difference} from "../../models/difference";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'record-comparison-content',
  templateUrl: './record-comparison-content.component.html',
  styleUrls: ['./record-comparison-content.component.scss'],
})
export class RecordComparisonContentComponent implements OnInit {
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

  stateList = {
    isLoading: false,
    comparisonLoaded: false
  }
  testCases: any;

  patientResource: any;

  userDocumentWrapper: MdiToEDRSDocumentWrapper;
  referenceDocumentWrapper: MdiToEDRSDocumentWrapper;
  referenceDocument: any = undefined;
  difference: Difference = undefined;

  selectedTestCase: any = undefined;

  patient: USCorePatientDiff = new USCorePatientDiff( undefined, undefined );
  mdiToEdrs: CompositionMdiToEdrsDiff = new CompositionMdiToEdrsDiff( undefined, undefined );
  location: USCoreLocationDiff = new USCoreLocationDiff( undefined, undefined );
  pregnancy: ObservationDecedentPregnancyDiff = new ObservationDecedentPregnancyDiff( undefined, undefined );
  deathDate: ObservationDeathDateDiff;
  mannerOfDeath: ObservationMannerOfDeathDiff;
  practitioner: USCorePractitionerDiff;


  constructor(
    private userDocumentService: UserDocumentService,
    private referenceDocumentService: ReferenceDocumentService,
    private comparisonService: ComparisonService,
    private dialog: MatDialog,
    private decedentService: DecedentService,
    private documentHandler: DocumentHandlerService,
    private utilsService: UtilsService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    // If an "id" parameter is passed in the URL, load that case immediately.
    let compositionId = this.route.snapshot.params['id'];
    console.log(compositionId);
    if (compositionId) {
      this.isLoading = true;
      this.userDocumentService.getUserDocumentBundle(compositionId).subscribe(
        {
          next: (userDocumentWrapper: MdiToEDRSDocumentWrapper) => {
            this.userDocumentWrapper = userDocumentWrapper;
          }
        }
      );
    }

    // Get Reference Document List
    this.referenceDocumentService.getReferenceDocuments().subscribe(
      {next: value => {
        console.log(value);
          this.testCases = value;
          this.testCases.splice(0,0, {"display": "Select a reference record..."})
          this.selectedTestCase = this.testCases[0];
      }}
    );
  }

  runComparison() {
    this.difference = this.comparisonService.doDiff(this.userDocumentWrapper.documentBundle, this.referenceDocument);
    this.stateList.comparisonLoaded = true;
  }

  onReferenceDocumentChanged(event: any ) {
    if (event.isUserInput === true && event.source.value.bundle) {
      this.referenceDocumentWrapper = this.userDocumentService.createDocumentWrapper(event.source.value.bundle);
      this.referenceDocument = event.source.value.bundle;
      this.stateList.comparisonLoaded = false;
    }
  }

  onInputBundleClick() {
    const dialogRef = this.dialog.open( RecordComparisonDialogComponent, {data: null}).afterClosed().subscribe(data => {
      if (data) {
        const parsedBundle = JSON.parse( data ); // TODO: Add error handling.
        this.userDocumentWrapper = this.userDocumentService.createDocumentWrapper(parsedBundle);
        //this.dodiff(this.userDocumentWrapper.documentBundle, this.referenceDocument);
        //this.isAccordionExpanded = false;
      }
    });
  }

  clearCase() {
    this.userDocumentWrapper = undefined;
    //
    // this.patient = new USCorePatientDiff( undefined, undefined );
    // this.mdiToEdrs = new CompositionMdiToEdrsDiff( undefined, undefined );
    // this.location = new USCoreLocationDiff( undefined, undefined );
    // this.tobaccoUse = new ObservationTobaccoUseDiff( undefined, undefined );
    // this.pregnancy = new ObservationDecedentPregnancyDiff( undefined, undefined );
    // this.deathDate = new ObservationDeathDateDiff( undefined, undefined);
    // this.causeOfDeath1List = [];
    // this.causeOfDeath2 = new ObservationCauseOfDeathPart2Diff( undefined, undefined );
    // this.mannerOfDeath = new ObservationMannerOfDeathDiff( undefined, undefined );
    // this.practitioner = new USCorePractitionerDiff( undefined, undefined );
    // this.locationDeath = new LocationDeathDiff( undefined, undefined );
    // this.locationInjury = new LocationInjuryDiff( undefined, undefined );
    // this.autopsyPerformed = new ObservationAutopsyPerformedDiff( undefined, undefined );
    // this.howDeathOccurred = new ObservationHowDeathInjuryOccurredDiff( undefined, undefined );
    //
    // this.demographicsStatus = 'invalid';
    // this.circumstancesStatus = 'invalid';
    // this.caseAdminInfoStatus = 'invalid';
    // this.jurisdictionStatus = 'invalid';
    // this.causeAndMannerStatus = 'invalid';
    // this.medicalHistoryStatus = 'invalid';
    // this.examAndHistoryStatus = 'invalid';
    // this.narrativesStatus = 'invalid';
    // this.deathDateStatus = 'invalid';
    // this.deathDateStatus = 'invalid';
    // this.examAndAutopsyStatus = 'invalid';
    // this.howDeathOccurredStatus = 'invalid';

    this.difference = this.comparisonService.doDiff(undefined, undefined);
  }

  // dodiff(userDocument: any, referenceDocument: any) {
  //   try {
  //     this.mdiToEdrs = new CompositionMdiToEdrsDiff(
  //       this.bundleHelper.findResourceByProfileName( userDocument, this.profileProvider.getMdiProfiles().Comp_MDItoEDRS ),
  //       this.bundleHelper.findResourceByProfileName( referenceDocument, this.profileProvider.getMdiProfiles().Comp_MDItoEDRS ));
  //
  //     this.location = new USCoreLocationDiff(
  //       this.bundleHelper.findResourceByProfileName( userDocument, this.profileProvider.getMdiProfiles().USCoreLocation ),
  //       this.bundleHelper.findResourceByProfileName( referenceDocument, this.profileProvider.getMdiProfiles().USCoreLocation ));
  //
  //     this.tobaccoUse = new ObservationTobaccoUseDiff(
  //       this.bundleHelper.findResourceByProfileName( userDocument, this.profileProvider.getMdiProfiles().Obs_TobaccoUseContributedToDeath ),
  //       this.bundleHelper.findResourceByProfileName( referenceDocument, this.profileProvider.getMdiProfiles().Obs_TobaccoUseContributedToDeath ));
  //
  //     this.pregnancy = new ObservationDecedentPregnancyDiff(
  //       this.bundleHelper.findResourceByProfileName( userDocument, this.profileProvider.getMdiProfiles().Obs_DecedentPregnancy ),
  //       this.bundleHelper.findResourceByProfileName( referenceDocument, this.profileProvider.getMdiProfiles().Obs_DecedentPregnancy ));
  //
  //     this.deathDate = new ObservationDeathDateDiff(
  //       this.bundleHelper.findResourceByProfileName( userDocument, this.profileProvider.getMdiProfiles().Obs_DeathDate ),
  //       this.bundleHelper.findResourceByProfileName( referenceDocument, this.profileProvider.getMdiProfiles().Obs_DeathDate ),
  //       this.fhirHelper);
  //
  //     this.causeOfDeath1List = [];
  //     let actualCauseOfDeath1List = this.bundleHelper.findResourcesByProfileName( userDocument, this.profileProvider.getMdiProfiles().Obs_CauseOfDeathPart1 );
  //     let expectedCauseOfDeath1List = this.bundleHelper.findResourcesByProfileName( referenceDocument, this.profileProvider.getMdiProfiles().Obs_CauseOfDeathPart1 );
  //
  //     this.causeAndMannerStatus = 'valid';
  //
  //     if (expectedCauseOfDeath1List != undefined) {
  //       expectedCauseOfDeath1List.map((item: any, i) => {
  //         let causeOfDeath1 = undefined;
  //         if (actualCauseOfDeath1List != undefined && actualCauseOfDeath1List.length > i) {
  //           causeOfDeath1 = new ObservationCauseOfDeathPart1Diff( actualCauseOfDeath1List[i], expectedCauseOfDeath1List[i], this.fhirHelper );
  //         } else {
  //           causeOfDeath1 = new ObservationCauseOfDeathPart1Diff( null, expectedCauseOfDeath1List[i], this.fhirHelper );
  //         }
  //         this.causeOfDeath1List.push( causeOfDeath1 );
  //         if (causeOfDeath1.valueCodeableConcept.style === 'invalid')
  //         {
  //           this.causeAndMannerStatus = 'invalid';
  //         }
  //         if (causeOfDeath1.valueString.style === 'invalid')
  //         {
  //           this.causeAndMannerStatus = 'invalid';
  //         }
  //       })
  //     }
  //
  //     this.causeOfDeath2 = new ObservationCauseOfDeathPart2Diff(
  //       this.bundleHelper.findResourceByProfileName( userDocument, this.profileProvider.getMdiProfiles().Obs_CauseOfDeathPart2 ),
  //       this.bundleHelper.findResourceByProfileName( referenceDocument, this.profileProvider.getMdiProfiles().Obs_CauseOfDeathPart2 ));
  //
  //     this.mannerOfDeath = new ObservationMannerOfDeathDiff(
  //       this.bundleHelper.findResourceByProfileName( userDocument, this.profileProvider.getMdiProfiles().Obs_MannerOfDeath ),
  //       this.bundleHelper.findResourceByProfileName( referenceDocument, this.profileProvider.getMdiProfiles().Obs_MannerOfDeath ));
  //
  //     this.locationDeath = new LocationDeathDiff(
  //       this.bundleHelper.findResourceByProfileName( userDocument, this.profileProvider.getMdiProfiles().Loc_death ),
  //       this.bundleHelper.findResourceByProfileName( referenceDocument, this.profileProvider.getMdiProfiles().Loc_death ));
  //
  //     this.locationInjury = new LocationInjuryDiff(
  //       this.bundleHelper.findResourceByProfileName( userDocument, this.profileProvider.getMdiProfiles().Loc_injury ),
  //       this.bundleHelper.findResourceByProfileName( referenceDocument, this.profileProvider.getMdiProfiles().Loc_injury ));
  //
  //     this.patient = new USCorePatientDiff(
  //       this.bundleHelper.findResourceByProfileName( userDocument, this.profileProvider.getMdiProfiles().USCorePatient ),
  //       this.bundleHelper.findResourceByProfileName( referenceDocument, this.profileProvider.getMdiProfiles().USCorePatient ));
  //
  //     this.practitioner = new USCorePractitionerDiff(
  //       this.bundleHelper.findResourceByProfileName( userDocument, this.profileProvider.getMdiProfiles().USCorePractitioner ),
  //       this.bundleHelper.findResourceByProfileName( referenceDocument, this.profileProvider.getMdiProfiles().USCorePractitioner ));
  //
  //     this.autopsyPerformed = new ObservationAutopsyPerformedDiff(
  //       this.bundleHelper.findResourceByProfileName( userDocument, this.profileProvider.getMdiProfiles().Obs_AutopsyPerformed ),
  //       this.bundleHelper.findResourceByProfileName( referenceDocument, this.profileProvider.getMdiProfiles().Obs_AutopsyPerformed ));
  //
  //     this.howDeathOccurred = new ObservationHowDeathInjuryOccurredDiff(
  //       this.bundleHelper.findResourceByProfileName( userDocument, this.profileProvider.getMdiProfiles().Obs_HowDeathInjuryOccurred ),
  //       this.bundleHelper.findResourceByProfileName( referenceDocument, this.profileProvider.getMdiProfiles().Obs_HowDeathInjuryOccurred ));
  //
  //     this.caseAdminInfoStatus = (
  //       this.mdiToEdrs.extension.style === 'valid' &&
  //       this.practitioner.name.style === 'valid' &&
  //       this.practitioner.identifier.style === 'valid' &&
  //       this.practitioner.telecom.style === 'valid' &&
  //       this.practitioner.address.style === 'valid'
  //     ) ? 'valid' : 'invalid';
  //
  //     this.demographicsStatus = (
  //       this.patient.name.style === 'valid' &&
  //       this.patient.gender.style === 'valid' &&
  //       this.patient.identifier.style === 'valid' &&
  //       this.patient.birthDate.style === 'valid' &&
  //       this.patient.ethnicity.style === 'valid' &&
  //       this.patient.race.style === 'valid' &&
  //       this.patient.address.style === 'valid'
  //     ) ? 'valid' : 'invalid';
  //
  //     this.circumstancesStatus = (
  //       this.locationDeath.name.style === 'valid' &&
  //       this.locationInjury.name.style === 'valid' &&
  //       this.tobaccoUse.valueCodeableConcept.style === 'valid' &&
  //       this.pregnancy.valueCodeableConcept.style === 'valid'
  //     ) ? 'valid' : 'invalid';
  //
  //     this.jurisdictionStatus = (
  //       this.deathDate.pronouncedDateTime.style === 'valid' &&
  //       this.deathDate.effectiveDateTime.style === 'valid' &&
  //       this.deathDate.method.style === 'valid'
  //     ) ? 'valid' : 'invalid';
  //
  //     this.examAndAutopsyStatus = (
  //       this.autopsyPerformed.valueCodeableConcept.style === 'valid' &&
  //       this.autopsyPerformed.componentValueCodeableConcept.style === 'valid'
  //     ) ? 'valid' : 'invalid';
  //
  //     this.causeAndMannerStatus = (
  //       this.causeAndMannerStatus === 'valid' &&
  //       this.howDeathOccurred.placeOfInjury.style === 'valid' &&
  //       this.howDeathOccurred.howDeathInjuryOccurred.style === 'valid' &&
  //       this.howDeathOccurred.effectiveDateTime.style === 'valid' &&
  //       this.howDeathOccurred.injuryOccurredAtWork.style === 'valid' &&
  //       this.howDeathOccurred.transportationRole.style === 'valid'
  //     ) ? 'valid' : 'invalid';
  //
  //     if (this.causeOfDeath2.valueCodeableConcept.style === 'invalid' )
  //     {
  //       this.causeAndMannerStatus = 'invalid';
  //     }
  //
  //     if (this.mannerOfDeath.valueCodeableConcept.style === 'invalid' )
  //     {
  //       this.causeAndMannerStatus = 'invalid';
  //     }
  //
  //   } catch(e) {
  //     console.log(e);
  //   }
  // }

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
