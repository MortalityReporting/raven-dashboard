import {FhirResource} from "../../fhir-util";

export interface CompositionPatientPair {
  composition: FhirResource;  // or use a specific Composition interface
  patient: FhirResource;      // or use a specific Patient interface
}
