import {FhirElement} from "./fhir.element";
import {Extension} from "./fhir.extension";

export class BackboneElement extends FhirElement {
  modifierExtension?: Extension[];
}
