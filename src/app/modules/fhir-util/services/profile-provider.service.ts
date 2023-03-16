import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileProviderService {

  constructor() { }

  public getMdiProfiles(): any {
    return {
      USCoreLocation: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-location",
      USCorePatient: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient",
      USCorePractitioner: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-practitioner",
      Comp_MDItoEDRS: "http://hl7.org/fhir/us/mdi/StructureDefinition/Composition-mdi-to-edrs",
      Doc_MDItoEDRS: "http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-document-mdi-to-edrs",
      List_CauseOfDeathPathway: "http://hl7.org/fhir/us/mdi/StructureDefinition/List-cause-of-death-pathway",
      Obs_CauseOfDeathCondition: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-cause-of-death-condition",
      Obs_ConditionContributingToDeath: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-condition-contributing-to-death",
      Obs_DeathDate: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-death-date",
      Obs_DeathInjuryEventOccurredAtWork: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-death-injury-at-work",
      Obs_DecedentPregnancy: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-decedent-pregnancy",
      Obs_HowDeathInjuryOccurred: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-how-death-injury-occurred",
      Obs_MannerOfDeath: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-manner-of-death",
      Obs_TobaccoUseContributedToDeath: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-tobacco-use-contributed-to-death",
      Obs_CauseOfDeathPart1: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-cause-of-death-part1",
      Obs_CauseOfDeathPart2: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-contributing-cause-of-death-part2",
      Obs_AutopsyPerformed: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-autopsy-performed-indicator",
      Loc_death: "http://hl7.org/fhir/us/mdi/StructureDefinition/Location-death",
      Loc_injury: "http://hl7.org/fhir/us/mdi/StructureDefinition/Location-injury"
    }
  }
}
