import {ComparisonFhirType} from "./comparison-model";

export class Compare {
  static compareField(uValue: any, cValue: any, type: ComparisonFhirType): boolean {
    if (type === ComparisonFhirType.STRING) {
      return uValue === cValue
    }
    return false;
  }
}
