import {Extension} from "../../fhir-util";

export class TrackingNumberExtension {
  value: string;
  type?: string;
  system?: string;

  constructor(extension?: Extension) {
    //TODO Map here.
  }
}

export const trackingNumberUrl = "http://hl7.org/fhir/us/mdi/StructureDefinition/Extension-tracking-number"

export enum TrackingNumberType {
  Mdi = "mdi-case-number",
  Edrs = "edrs-file-number",
  Tox = "tox-lab-case-number"
}
