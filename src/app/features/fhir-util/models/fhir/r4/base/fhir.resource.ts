export interface FhirResource extends Object {
  resourceType: string;
  id?: string;
  meta?: any; // TODO: Implement Meta Type
  implicitRules?: string;
  language?: string;
  [key: string]: any; // TODO: Remove in complete implementation.
}
