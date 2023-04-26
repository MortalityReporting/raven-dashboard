import {Coding} from "./coding";
import {FhirType} from "../base/fhir.type";

export class CodeableConcept implements FhirType {
  coding: Coding[];
  text: string;
}
