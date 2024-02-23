// Use this file to modify profile defining URLs.
import {Injectable} from "@angular/core";

@Injectable()
export class FHIRProfileConstants {
  static Profiles = new FHIRProfileConstants();

  USCore = {
    USCoreLocation: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-location", //
    USCorePatient: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient", // Obsolete?
    USCorePractitioner: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-practitioner" // Obsolete?
  }

  VRCL = {
    Practitioner_VR: "http://hl7.org/fhir/us/vr-common-library/StructureDefinition/Practitioner-vr",
    Patient_VR: "https://build.fhir.org/ig/HL7/vr-common-library//StructureDefinition-Patient-vr.html",
    Obs_AutopsyPerformed: "http://hl7.org/fhir/us/vr-common-library/StructureDefinition/Observation-autopsy-performed-indicator-vr"
  }

  VRDR = {
    Loc_DeathLocation: "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-death-location",
    Loc_InjuryLocation: "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-injury-location",
    Obs_CauseOfDeathPart2: "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-cause-of-death-part2",
    Obs_DeathDate: "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-death-date",
    Obs_DecedentPregnancyStatus: "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-decedent-pregnancy-status",
    Obs_InjuryIncident: "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-injury-incident",
    Obs_MannerOfDeath: "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-manner-of-death",
    Obs_TobaccoUseContributedToDeath: "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-tobacco-use-contributed-to-death",

  }

  MdiToEdrs = {
    Comp_MDItoEDRS: "http://hl7.org/fhir/us/mdi/StructureDefinition/Composition-mdi-and-edrs",
    Doc_MDItoEDRS: "http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-document-mdi-and-edrs",
    List_CauseOfDeathPathway: "http://hl7.org/fhir/us/mdi/StructureDefinition/List-cause-of-death-pathway",
    Obs_CauseOfDeathCondition: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-cause-of-death-condition",
    Obs_ConditionContributingToDeath: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-condition-contributing-to-death",
    Obs_DeathInjuryEventOccurredAtWork: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-death-injury-at-work",
    Obs_CauseOfDeathPart1: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-mdi-cause-of-death-part1",
    //Obs_AutopsyPerformed: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-autopsy-performed-indicator",
  }

  ToxToMdi = {
    Tox_Diagnostic_Report: "http://hl7.org/fhir/us/mdi/StructureDefinition/DiagnosticReport-toxicology-to-mdi"
  }
}

// TODO: Shift all of this into the object above and refactor related parts of the code.

// export const USCoreLocation: string = "http://hl7.org/fhir/us/core/StructureDefinition/us-core-location";
// export const USCorePatient: string = "http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient";
// export const USCorePractitioner: string = "http://hl7.org/fhir/us/core/StructureDefinition/us-core-practitioner";

