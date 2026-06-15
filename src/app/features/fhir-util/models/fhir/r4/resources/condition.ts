import {DomainResource} from "../base/fhir.domain-resource";

export class Condition implements DomainResource {
  [key: string]: any;

  resourceType: string = "Condition";
}
