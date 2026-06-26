/**
 * Type Aliases for FHIR Primitives with constraints where possible.
 */

export class PrimitiveType {
  // EMPTY. DO NOT USE.
}

export type Base64Binary<imageType extends string> = `data:image/${imageType};base64${string}`;
// const base64_example: Base64<'jpeg'> = 'data:image/jpeg;base64bunchOfDataHere'
// export type Boolean = boolean; -- Use standard boolean type to not conflict with Boolean.
export type Code = string;
export type DateTime = string;
export type Decimal = number;
export type Instant = string;
export type Integer = number;
export type Markdown = string;
export type PositiveInt = number;
// export type String = string; -- Use standard string type to not conflict with String.
export type Time = string;
export type UnsignedInt = number;
export type Uri = string;

function validateRegEx(value: string, matchExpression: RegExp) {
  // TODO: Implement Regex Validation for a given primitive against FHIR Spec.
}
