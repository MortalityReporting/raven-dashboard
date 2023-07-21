import {FhirResource} from "../../fhir-util";
import {EventItem} from "./event-item";

export class EventModule {
  static constructFromFHIR(questionnaire: FhirResource): EventModule {
    let event = new EventModule();
    event.fhirId = questionnaire?.['id'];
    event.title = questionnaire?.['title'];
    let tests: EventItem[] = [];
    questionnaire["item"].forEach(item => {
      tests.push(new EventItem(item));
    });
    event.items = tests;
    return event;
  }

  fhirId: string;
  title: string;
  items: EventItem[];
}

