import {BackboneElement} from "../base/fhir.backbone-element";
import {DomainResource} from "../base/fhir.domain-resource";

export class CodeSystem implements DomainResource {
  resourceType: string = "CodeSystem";
  [key: string]: any; // TODO: Remove once fully implemented.
  uri: string;
  concept: Concept[];
}

export class Concept extends BackboneElement {
  code: string;
  display: string;
  definition: string;
}
