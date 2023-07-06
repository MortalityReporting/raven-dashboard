import {FhirResource} from "../../fhir-util";

export class EventRegistration {
  static constructFromFHIR(questionnaireResponse: FhirResource): EventRegistration {
    let registration = new EventRegistration();
    registration.fhirId = questionnaireResponse?.['id'];
    registration.questionnaire = questionnaireResponse?.['questionnaire'];
    return registration;
  }

  fhirId: string;
  questionnaire: string;
}
