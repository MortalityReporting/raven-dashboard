
import {FhirResource} from "../../fhir-util";

export interface CombinedPatientObservationsComposition {
  composition: FhirResource;
  patient: FhirResource | null;
  todObservation: FhirResource | null;
  mannerOfDeathObservation: FhirResource | null;
}
