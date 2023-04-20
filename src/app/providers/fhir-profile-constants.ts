// Use this file to modify profile defining URLs.
import {Injectable} from "@angular/core";

@Injectable()
export class FHIRProfileConstants {
  static Profiles = new FHIRProfileConstants();

  USCore = {
    USCoreLocation: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-location",
    USCorePatient: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient",
    USCorePractitioner: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-practitioner"
  }

  ToxToMdi = {
    Tox_Diagnostic_Report: "http://hl7.org/fhir/us/mdi/StructureDefinition/DiagnosticReport-toxicology-to-mdi"
  }
}

// TODO: Shift all of this into the object above and refactor related parts of the code.

export const USCoreLocation: string = "http://hl7.org/fhir/us/core/StructureDefinition/us-core-location";
export const USCorePatient: string = "http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient";
export const USCorePractitioner: string = "http://hl7.org/fhir/us/core/StructureDefinition/us-core-practitioner";

export const Comp_MDItoEDRS: string = "http://hl7.org/fhir/us/mdi/StructureDefinition/Composition-mdi-to-edrs";
export const Doc_MDItoEDRS: string = "http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-document-mdi-to-edrs";
export const List_CauseOfDeathPathway: string = "http://hl7.org/fhir/us/mdi/StructureDefinition/List-cause-of-death-pathway";
export const Obs_CauseOfDeathCondition: string = "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-cause-of-death-condition";
export const Obs_ConditionContributingToDeath: string = "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-condition-contributing-to-death";
export const Obs_DeathDate: string = "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-death-date";
export const Obs_DeathInjuryEventOccurredAtWork: string = "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-death-injury-at-work";
export const Obs_DecedentPregnancy: string = "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-decedent-pregnancy";
export const Obs_HowDeathInjuryOccurred: string = "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-how-death-injury-occurred";
export const Obs_MannerOfDeath: string = "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-manner-of-death";
export const Obs_TobaccoUseContributedToDeath: string = "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-tobacco-use-contributed-to-death";
export const Obs_CauseOfDeathPart1: string = "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-cause-of-death-part1";
export const Obs_CauseOfDeathPart2: string = "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-contributing-cause-of-death-part2";
export const Obs_AutopsyPerformed = "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-autopsy-performed-indicator";
export const Loc_death: string = "http://hl7.org/fhir/us/mdi/StructureDefinition/Location-death";
export const Loc_injury: string = "http://hl7.org/fhir/us/mdi/StructureDefinition/Location-injury";
export enum Profiles {
  Obs_DeathInjuryEventOccurredAtWork = "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-death-injury-at-work"
}
