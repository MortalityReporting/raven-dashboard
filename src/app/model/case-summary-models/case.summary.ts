import {HumanName} from "../fhir/types/human.name";
import {Identifier} from "../fhir/types/identifier";
import {CodeableConcept} from "../fhir/types/codeable.cocept";

export class CaseSummary {
  demographics: Demographics;
  circumstances: Circumstances;
  causeAndManner: CauseAndManner;
  medicalHistory: string = "Not Implemented"; // TODO: Implement.
  examAndAutopsy: string = "Not Implemented"; // TODO: Implement.
  narratives: string = "Not Implemented"; // TODO: Implement.
}

export class Demographics {
  aliases: HumanName[];
  gender: string;
  birthDate: string;
  ssn: string;
  identifiers: Identifier[]; // Other non-SSN Identifiers present
  race: string; // TODO: Setup FHIR Type
  ethnicity: string; // TODO: Setup FHIR Type
  maritalStatus: string;
  usualWork: UsualWork;
}

export class Circumstances {
  deathLocation: string;
  workInjury: string;
  tobaccoUseContributed: string;
  pregnancy: string;
}

// Individual Resources and Parts

export class UsualWork {
  occupation: string;
  industry: string;
  duration: string;
}

export class CauseAndManner {
  causeOfDeathConditions: CauseOfDeathCondition[];
  contributingConditions: string[]; // TODO: Does this need a model?
  mannerOfDeath: string;
  howDeathInjuryOccurred: string;

  constructor() {
    this.causeOfDeathConditions = new Array();
  }
}

export class CauseOfDeathCondition {
  value: CodeableConcept;
  interval: Interval;

  constructor( value: CodeableConcept, interval: Interval ) {    
    this.value = value;
    this.interval = interval;
  }
}

export class Interval {
  text: string; // Either equals valueString directly, or if valueQuantity (value + " " + unit).
}
