import {FhirType} from "../base/fhir.type";

export class Period implements FhirType {
  start: string;
  end: string;
}
