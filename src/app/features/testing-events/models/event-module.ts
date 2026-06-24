import {FhirResource} from "../../fhir-util";
import {EventItem} from "./event-item";

// TODO: Switch to follow the Registration model where it extends the FHIR Resource.
export class EventModule {
  static constructFromFHIR(questionnaire: FhirResource): EventModule {
    let event = new EventModule();
    event.fhirId = questionnaire?.['id'];
    event.title = questionnaire?.['title'];
    event.machineReadableName = questionnaire?.['name'];
    event.description = questionnaire?.['description'] || "No description found.";
    let tests: EventItem[] = [];
    questionnaire["item"].forEach(item => {
      tests.push(new EventItem(item));
    });
    event.items = tests;
    return event;
  }

  fhirId: string;
  title: string;
  machineReadableName: string;
  items: EventItem[];
  description: string;
}

