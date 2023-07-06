import {FhirResource} from "../../fhir-util";

export class EventModule {
  static constructFromFHIR(questionnaire: FhirResource): EventModule {
    let event = new EventModule();
    event.fhirId = questionnaire?.['id'];
    event.title = questionnaire?.['title'];
    return event;
  }

  fhirId: string;
  title: string;
}
