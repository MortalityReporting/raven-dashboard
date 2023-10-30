import {Extension} from "./fhir.extension";
import {FhirBase} from "./fhir.base";

export class FhirElement implements FhirBase {
  constructor(extensions?: Extension[]) {
    if (extensions) this.extension = extensions;
  }

  id?: string; // https://www.hl7.org/fhir/types-definitions.html#Element.id
  extension?: Extension[];
}
