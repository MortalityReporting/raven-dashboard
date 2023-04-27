import {FhirType} from "../base/fhir.type";

export class Coding implements FhirType{
  system: string;
  version: string;
  code: string;
  display: string;
  userSelected: boolean;
}
