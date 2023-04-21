import {Inject, Injectable} from '@angular/core';
import {CompositionMdiToEdrsDiff} from "../models/composition-mdi-to-edrs.diff";
import {USCoreLocationDiff} from "../models/us-core-location.diff";
import {ObservationTobaccoUseDiff} from "../models/observation-tobacco-use.diff";
import {ObservationDecedentPregnancyDiff} from "../models/observation-decedent-pregnancy.diff";
import {ObservationDeathDateDiff} from "../models/observation-death-date.diff";
import {ObservationCauseOfDeathPart1Diff} from "../models/observation-cause-of-death-part-1.diff";
import {ObservationCauseOfDeathPart2Diff} from "../models/observation-cause-of-death-part-2.diff";
import {ObservationMannerOfDeathDiff} from "../models/observation-manner-of-death.diff";
import {LocationDeathDiff} from "../models/location-death.diff";
import {LocationInjuryDiff} from "../models/location-injury.diff";
import {USCorePatientDiff} from "../models/us-core-patient.diff";
import {USCorePractitionerDiff} from "../models/us-core-practitioner.diff";
import {ObservationAutopsyPerformedDiff} from "../models/observation-autopsy-performed.diff";
import {ObservationHowDeathInjuryOccurredDiff} from "../models/observation-how-death-injury-occurred.diff";
import {BundleHelperService} from "../../fhir-util/services/bundle-helper.service";
import {Difference} from "../models/difference";
import {FhirHelperService} from "../../fhir-util/services/fhir-helper.service";
import {FHIRProfileConstants} from "../../../providers/fhir-profile-constants";

@Injectable({
  providedIn: 'root'
})
export class ComparisonService {

  constructor(
    private bundleHelper: BundleHelperService,
    private fhirHelper: FhirHelperService,
    @Inject('fhirProfiles') public fhirProfiles: FHIRProfileConstants
  ) { }



  doDiff(userDocument: any, referenceDocument: any): Difference {
    let difference = new Difference();
    try {
      difference.mdiToEdrs = new CompositionMdiToEdrsDiff(
        this.bundleHelper.findResourceByProfileName(userDocument, this.fhirProfiles.MdiToEdrs.Comp_MDItoEDRS ),
        this.bundleHelper.findResourceByProfileName(referenceDocument, this.fhirProfiles.MdiToEdrs.Comp_MDItoEDRS)
      );

      difference.location = new USCoreLocationDiff(
        this.bundleHelper.findResourceByProfileName(userDocument, this.fhirProfiles.USCore.USCoreLocation),
        this.bundleHelper.findResourceByProfileName(referenceDocument, this.fhirProfiles.USCore.USCoreLocation)
      );

      difference.tobaccoUse = new ObservationTobaccoUseDiff(
        this.bundleHelper.findResourceByProfileName(userDocument, this.fhirProfiles.MdiToEdrs.Obs_TobaccoUseContributedToDeath),
        this.bundleHelper.findResourceByProfileName(referenceDocument, this.fhirProfiles.MdiToEdrs.Obs_TobaccoUseContributedToDeath)
      );

      difference.pregnancy = new ObservationDecedentPregnancyDiff(
        this.bundleHelper.findResourceByProfileName(userDocument, this.fhirProfiles.MdiToEdrs.Obs_DecedentPregnancy ),
        this.bundleHelper.findResourceByProfileName(referenceDocument, this.fhirProfiles.MdiToEdrs.Obs_DecedentPregnancy )
      );

      difference.deathDate = new ObservationDeathDateDiff(
        this.bundleHelper.findResourceByProfileName(userDocument, this.fhirProfiles.MdiToEdrs.Obs_DeathDate ),
        this.bundleHelper.findResourceByProfileName(referenceDocument, this.fhirProfiles.MdiToEdrs.Obs_DeathDate ),
        this.fhirHelper
      );

      difference.causeOfDeath1List = [];
      let actualCauseOfDeath1List = this.bundleHelper.findResourcesByProfileName(userDocument, this.fhirProfiles.MdiToEdrs.Obs_CauseOfDeathPart1);
      let expectedCauseOfDeath1List = this.bundleHelper.findResourcesByProfileName(referenceDocument, this.fhirProfiles.MdiToEdrs.Obs_CauseOfDeathPart1);

      difference.causeAndMannerStatus = 'valid';

      if (expectedCauseOfDeath1List != undefined) {
        expectedCauseOfDeath1List.map((item: any, i) => {
          let causeOfDeath1 = undefined;
          if (actualCauseOfDeath1List != undefined && actualCauseOfDeath1List.length > i) {
            causeOfDeath1 = new ObservationCauseOfDeathPart1Diff( actualCauseOfDeath1List[i], expectedCauseOfDeath1List[i], this.fhirHelper );
          } else {
            causeOfDeath1 = new ObservationCauseOfDeathPart1Diff( null, expectedCauseOfDeath1List[i], this.fhirHelper);
          }
          difference.causeOfDeath1List.push( causeOfDeath1 );
          if (causeOfDeath1.valueCodeableConcept.style === 'invalid')
          {
            difference.causeAndMannerStatus = 'invalid';
          }
          if (causeOfDeath1.valueString.style === 'invalid')
          {
            difference.causeAndMannerStatus = 'invalid';
          }
        })
      }

      difference.causeOfDeath2 = new ObservationCauseOfDeathPart2Diff(
        this.bundleHelper.findResourceByProfileName( userDocument, this.fhirProfiles.MdiToEdrs.Obs_CauseOfDeathPart2 ),
        this.bundleHelper.findResourceByProfileName( referenceDocument, this.fhirProfiles.MdiToEdrs.Obs_CauseOfDeathPart2 ));

      difference.mannerOfDeath = new ObservationMannerOfDeathDiff(
        this.bundleHelper.findResourceByProfileName( userDocument, this.fhirProfiles.MdiToEdrs.Obs_MannerOfDeath ),
        this.bundleHelper.findResourceByProfileName( referenceDocument, this.fhirProfiles.MdiToEdrs.Obs_MannerOfDeath ));

      difference.locationDeath = new LocationDeathDiff(
        this.bundleHelper.findResourceByProfileName( userDocument, this.fhirProfiles.MdiToEdrs.Loc_death ),
        this.bundleHelper.findResourceByProfileName( referenceDocument, this.fhirProfiles.MdiToEdrs.Loc_death ));

      difference.locationInjury = new LocationInjuryDiff(
        this.bundleHelper.findResourceByProfileName( userDocument, this.fhirProfiles.MdiToEdrs.Loc_injury ),
        this.bundleHelper.findResourceByProfileName( referenceDocument, this.fhirProfiles.MdiToEdrs.Loc_injury ));

      difference.patient = new USCorePatientDiff(
        this.bundleHelper.findResourceByProfileName( userDocument, this.fhirProfiles.USCore.USCorePatient ),
        this.bundleHelper.findResourceByProfileName( referenceDocument, this.fhirProfiles.USCore.USCorePatient ));

      difference.practitioner = new USCorePractitionerDiff(
        this.bundleHelper.findResourceByProfileName( userDocument, this.fhirProfiles.USCore.USCorePractitioner ),
        this.bundleHelper.findResourceByProfileName( referenceDocument, this.fhirProfiles.USCore.USCorePractitioner ));

      difference.autopsyPerformed = new ObservationAutopsyPerformedDiff(
        this.bundleHelper.findResourceByProfileName( userDocument, this.fhirProfiles.MdiToEdrs.Obs_AutopsyPerformed ),
        this.bundleHelper.findResourceByProfileName( referenceDocument, this.fhirProfiles.MdiToEdrs.Obs_AutopsyPerformed ));

      difference.howDeathOccurred = new ObservationHowDeathInjuryOccurredDiff(
        this.bundleHelper.findResourceByProfileName( userDocument, this.fhirProfiles.MdiToEdrs.Obs_HowDeathInjuryOccurred ),
        this.bundleHelper.findResourceByProfileName( referenceDocument, this.fhirProfiles.MdiToEdrs.Obs_HowDeathInjuryOccurred ));

      difference.caseAdminInfoStatus = (
        difference.mdiToEdrs.extension.style === 'valid' &&
        difference.practitioner.name.style === 'valid' &&
        difference.practitioner.identifier.style === 'valid' &&
        difference.practitioner.telecom.style === 'valid' &&
        difference.practitioner.address.style === 'valid'
      ) ? 'valid' : 'invalid';

      difference.demographicsStatus = (
        difference.patient.name.style === 'valid' &&
        difference.patient.gender.style === 'valid' &&
        difference.patient.identifier.style === 'valid' &&
        difference.patient.birthDate.style === 'valid' &&
        difference.patient.ethnicity.style === 'valid' &&
        difference.patient.race.style === 'valid' &&
        difference.patient.address.style === 'valid'
      ) ? 'valid' : 'invalid';

      difference.circumstancesStatus = (
        difference.locationDeath.name.style === 'valid' &&
        difference.locationInjury.name.style === 'valid' &&
        difference.tobaccoUse.valueCodeableConcept.style === 'valid' &&
        difference.pregnancy.valueCodeableConcept.style === 'valid'
      ) ? 'valid' : 'invalid';

      difference.jurisdictionStatus = (
        difference.deathDate.pronouncedDateTime.style === 'valid' &&
        difference.deathDate.effectiveDateTime.style === 'valid' &&
        difference.deathDate.method.style === 'valid'
      ) ? 'valid' : 'invalid';

      difference.examAndAutopsyStatus = (
        difference.autopsyPerformed.valueCodeableConcept.style === 'valid' &&
        difference.autopsyPerformed.componentValueCodeableConcept.style === 'valid'
      ) ? 'valid' : 'invalid';

      difference.causeAndMannerStatus = (
        difference.causeAndMannerStatus === 'valid' &&
        difference.howDeathOccurred.placeOfInjury.style === 'valid' &&
        difference.howDeathOccurred.howDeathInjuryOccurred.style === 'valid' &&
        difference.howDeathOccurred.effectiveDateTime.style === 'valid' &&
        difference.howDeathOccurred.injuryOccurredAtWork.style === 'valid' &&
        difference.howDeathOccurred.transportationRole.style === 'valid'
      ) ? 'valid' : 'invalid';

      if (difference.causeOfDeath2.valueCodeableConcept.style === 'invalid' )
      {
        difference.causeAndMannerStatus = 'invalid';
      }

      if (difference.mannerOfDeath.valueCodeableConcept.style === 'invalid' )
      {
        difference.causeAndMannerStatus = 'invalid';
      }

    } catch(e) {
      console.log(e);
    }
    console.log(difference)
    return difference;
  }



}
