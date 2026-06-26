/** FHIR Base Models **/
export * from "./models/fhir/r4/base/fhir.backbone-element";
export * from "./models/fhir/r4/base/fhir.base";
export * from "./models/fhir/r4/base/fhir.domain-resource";
export * from "./models/fhir/r4/base/fhir.element";
export * from "./models/fhir/r4/base/fhir.extension";
export * from "./models/fhir/r4/base/fhir.primitive";
export * from "./models/fhir/r4/base/fhir.resource";
export * from "./models/fhir/r4/base/fhir.type";

/** FHIR Resource Models **/
export const SUPPORTED_RESOURCE_TYPES = [
  "Bundle",
  "Patient"
]
export * from "./models/fhir/r4/resources/bundle";
export * from "./models/fhir/r4/resources/code-system";
export * from "./models/fhir/r4/resources/condition";
export * from "./models/fhir/r4/resources/document-reference";
export * from "./models/fhir/r4/resources/patient";
export * from "./models/fhir/r4/resources/practitioner";
export * from "./models/fhir/r4/resources/questionnaire-response";

/** FHIR Type Models **/
export * from "./models/fhir/r4/types/address";
export * from "./models/fhir/r4/types/codeable-concept";
export * from "./models/fhir/r4/types/coding";
export * from "./models/fhir/r4/types/human-name";
export * from "./models/fhir/r4/types/identifier";

/** Services **/
export { BundleHelperService } from "./services/bundle-helper.service";
export { FhirClientService } from "./services/fhir-client.service";
export { FhirHelperService } from "./services/fhir-helper.service";
export { TerminologyHandlerService } from "./services/terminology-handler.service"

/** Pipes **/
export * from "./pipes/doc-ref-base64-transform.pipe"
