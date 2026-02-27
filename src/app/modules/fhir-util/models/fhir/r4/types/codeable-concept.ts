import {Coding} from "./coding";
import {FhirType} from "../base/fhir.type";

export class CodeableConcept extends FhirType {
  constructor(codeableConcept: any) {
    super();
    if (codeableConcept.text) this.text = codeableConcept.text;
    if (codeableConcept.coding) this.coding = codeableConcept.coding;
  }
  coding: Coding[];
  text: string;

  public override toString(): string {
    return this.text ?? this.coding?.[0]?.display ?? undefined;
  }
}
