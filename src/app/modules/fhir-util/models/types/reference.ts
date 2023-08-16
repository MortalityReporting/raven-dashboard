import {FhirType} from "../base/fhir.type";
import {Identifier} from "./identifier";

export class Reference extends FhirType {
  constructor(referenceId: string) {
    super();
    this.reference = referenceId;
  }
  reference?: string;
  type?: string;
  identifier?: Identifier;
  display?: string;
}
