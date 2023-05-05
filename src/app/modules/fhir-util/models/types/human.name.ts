import {Period} from "./period";
import {FhirType} from "../base/fhir.type";

export class HumanName extends FhirType {
  use: string;
  text: string;
  family: string;
  given: string[];
  prefix: string[];
  suffix: string[];
  period: Period;
}


