import {HumanName} from "../fhir/types/human.name";
import {Identifier} from "../fhir/types/identifier";
import {CodeableConcept} from "../fhir/types/codeable.cocept";
import {Address} from "../fhir/types/address";

export class CaseSummary {
  demographics: Demographics;
  circumstances: Circumstances;
  jurisdiction: Jurisdiction;
  causeAndManner: CauseAndManner;
  medicalHistory: string = "Not Implemented"; // TODO: Implement.
  examAndAutopsy: Autopsy;
  narratives: string = "Not Implemented"; // TODO: Implement.
  compositionId: string;
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
  address: Address;

  // constructor() {
  //   this.usualWork = [];
  // }
}

export class Circumstances {
  deathLocation: string;
  injuryLocation: string;
  tobaccoUseContributed: string;
  pregnancy: string;
}

export class Jurisdiction {
  deathDateTime: string;
  pronouncedDateTime: string;
  establishmentApproach: string;
  typeOfDeathLocation: string;
}

export class Autopsy {
  performed: string;
  resultsAvailable: string;
}

// Individual Resources and Parts

export class UsualWork {
  occupation: string;
  industry: string;
  duration: string;

  constructor( occupation: string, industry: string )
  {
    this.occupation = occupation;
    this.industry = industry;
  }
}

export class CauseAndManner {
  causeOfDeathPart1: CauseOfDeathPart1[];
  causeOfDeathPart2: CauseOfDeathPart2[];
  causeOfDeathConditions: CauseOfDeathCondition[];
  contributingConditions: string[]; // TODO: Does this need a model?
  mannerOfDeath: string;
  howDeathInjuryOccurred: string;
  injuryDateTime: string;
  placeOfInjury: string;
  workInjuryIndicator: string;
  transportationRole: string;

  constructor() {
    this.causeOfDeathPart1 = [];
    this.causeOfDeathPart2 = [];
    this.causeOfDeathConditions = [];
  }
}

export class CauseOfDeathPart1 {
  id: string;
  event: string;
  interval: string;
}

export class CauseOfDeathPart2 {
  id: string;
  value: string;
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

  constructor( text: string )
  {
    this.text = text;
  }
}
