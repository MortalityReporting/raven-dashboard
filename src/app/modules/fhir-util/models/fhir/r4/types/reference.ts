import {FhirType} from "../base/fhir.type";
import {Identifier} from "./identifier";

export class Reference extends FhirType {
  constructor(referenceString: string) {
    super();
    this.reference = referenceString;
  }
  reference?: string;
  type?: string;
  identifier?: Identifier;
  display?: string;
}
