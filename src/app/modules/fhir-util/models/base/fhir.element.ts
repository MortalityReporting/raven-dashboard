import {FhirBase} from "./fhir.base";
import {Extension} from "./fhir.extension";

export class FhirElement implements FhirBase {
  id?: string; // https://www.hl7.org/fhir/types-definitions.html#Element.id
  extension?: Extension[];

  constructor(extensions?: Extension[]) {
    if (extensions) this.extension = extensions;
  }
}
