import {FhirType} from "../base/fhir.type";

export class Coding extends FhirType {
  system?: string;
  version?: string;
  code?: string;
  display?: string;
  userSelected?: boolean;
}
