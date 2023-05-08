import {BackboneElement} from "../base/fhir.backbonelement";
import {DomainResource} from "../base/fhir.domainresource";

export class CodeSystem implements DomainResource {
  resourceType: string = "CodeSystem";
  [key: string]: any; // TODO: Remove once fully implemented.
  uri: string;
  concept: Concept[];
}
export class Concept implements BackboneElement {
  code: string;
  display: string;
  definition: string;
}
