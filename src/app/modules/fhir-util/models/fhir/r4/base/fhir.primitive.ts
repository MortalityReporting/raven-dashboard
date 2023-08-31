/**
 * Wrappers for string primitive to explicitly type in constructors. Do not use otherwise.
 */
import {FhirType} from "./fhir.type";

export class PrimitiveType {
  constructor(value: any) {
    this.value = value;
  }
  value: any;

  public getValue(): any {
    return this.value
  }
}

function validateRegEx(value: string, matchExpression: RegExp) {

}

export class StringType extends PrimitiveType {
  constructor(value: string) {
    super(value);
  }
  override value: string;
  override getValue(): string {
    return super.getValue();
  }
}

export class CodeType extends PrimitiveType {
  constructor(value: string) {
    super(value);
  }
  override value: string;
  override getValue(): string {
    return super.getValue();
  }
}

export class InstantType extends PrimitiveType {
  regex:RegExp = new RegExp("([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\\.[0-9]+)?(Z|(\\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))")
  constructor(value: string) {
    super(value);
  }
  override value: string;
  override getValue(): string {
    return super.getValue();
  }
}

export class UriType extends PrimitiveType {
  constructor(value: string) {
    super(value);
  }
  override value: string;
  override getValue(): string {
    return super.getValue();
  }
}
