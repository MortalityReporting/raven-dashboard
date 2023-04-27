import {Period} from "./period";
import {CodeableConcept} from "./codeable.cocept";
import {FhirType} from "../base/fhir.type";

export class Identifier implements FhirType {
  use: string;
  type: CodeableConcept;
  system: string;
  value: string;
  period: Period;
}
