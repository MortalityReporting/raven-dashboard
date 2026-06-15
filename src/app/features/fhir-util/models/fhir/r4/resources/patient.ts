import {DomainResource} from "../base/fhir.domain-resource";
import {AdministrativeGender} from "../value-sets/administrative-gender";

export class Patient implements DomainResource {
  resourceType: string = "Patient";
  gender?: AdministrativeGender;
}
