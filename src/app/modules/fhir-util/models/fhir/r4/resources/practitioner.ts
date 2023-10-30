import {DomainResource} from "../base/fhir.domain-resource";
import {AdministrativeGender} from "../value-sets/administrative-gender";
import {Identifier} from "../types/identifier";
import {HumanName} from "../types/human-name";

export class Practitioner implements DomainResource {
  resourceType: string = "Practitioner";
  name?: HumanName[];
  gender?: AdministrativeGender;
  identifier?: Identifier[];
}
