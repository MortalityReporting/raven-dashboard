import {CompositionMdiToEdrsDiff} from "./composition-mdi-to-edrs.diff";
import {USCoreLocationDiff} from "./us-core-location.diff";
import {ObservationTobaccoUseDiff} from "./observation-tobacco-use.diff";
import {ObservationDecedentPregnancyDiff} from "./observation-decedent-pregnancy.diff";
import {ObservationDeathDateDiff} from "./observation-death-date.diff";
import {ObservationCauseOfDeathPart2Diff} from "./observation-cause-of-death-part-2.diff";
import {ObservationMannerOfDeathDiff} from "./observation-manner-of-death.diff";
import {LocationDeathDiff} from "./location-death.diff";
import {LocationInjuryDiff} from "./location-injury.diff";
import {USCorePatientDiff} from "./us-core-patient.diff";
import {USCorePractitionerDiff} from "./us-core-practitioner.diff";
import {ObservationAutopsyPerformedDiff} from "./observation-autopsy-performed.diff";
import {ObservationHowDeathInjuryOccurredDiff} from "./observation-how-death-injury-occurred.diff";
import {ObservationCauseOfDeathPart1Diff} from "./observation-cause-of-death-part-1.diff";

export class Difference {
  caseAdminInfoStatus: any = undefined; // TODO: What type is this? String?
  demographicsStatus: any = undefined;
  circumstancesStatus: any = undefined;
  jurisdictionStatus: any = undefined;
  examAndAutopsyStatus: any = undefined;
  causeAndMannerStatus: any = undefined; // TODO: ???
  mdiToEdrs: CompositionMdiToEdrsDiff = undefined;
  location: USCoreLocationDiff = undefined;
  tobaccoUse: ObservationTobaccoUseDiff = undefined;
  pregnancy: ObservationDecedentPregnancyDiff = undefined;
  deathDate: ObservationDeathDateDiff = undefined;
  causeOfDeath1List: ObservationCauseOfDeathPart1Diff[] = undefined; // TODO: What class should this be?
  causeOfDeath2: ObservationCauseOfDeathPart2Diff = undefined;
  mannerOfDeath: ObservationMannerOfDeathDiff = undefined;
  locationDeath: LocationDeathDiff = undefined;
  locationInjury: LocationInjuryDiff = undefined;
  patient: USCorePatientDiff = undefined;
  practitioner: USCorePractitionerDiff = undefined;
  autopsyPerformed: ObservationAutopsyPerformedDiff = undefined;
  howDeathOccurred: ObservationHowDeathInjuryOccurredDiff = undefined;
}
