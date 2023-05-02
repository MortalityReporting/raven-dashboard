/**
 * Wrappers for string primitive to explicitly type in constructors. Do not use otherwise.
 */

class PrimitiveType {
  constructor(value: any) {
    this.value = value;
  }
  value: any;

  public getValue(): any {
    return this.value
  }
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
