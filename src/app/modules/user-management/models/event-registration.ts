import {FhirResource} from "../../fhir-util";
import {EventModule} from "./event-module";
import {EventItem} from "./event-item";

export class EventRegistration {
  static constructFromFHIR(questionnaireResponse: FhirResource, eventModules: EventModule[]):
      EventRegistration {
    let registration = new EventRegistration();
    registration.fhirId = questionnaireResponse?.['id'];
    registration.questionnaireReference = questionnaireResponse?.['questionnaire'];
    registration.setEventModuleByReference(eventModules);
    registration.items = registration.eventModule.items.slice();
    registration.items.forEach((item: EventItem) => {
      const linkId = item.linkId;
      const matchingItem = questionnaireResponse["item"]
        .find((item2: any) => item2.linkId === linkId)
      item.setStatus(matchingItem.answer[0].valueCoding.code)
    });
    return registration;
  }

  private setEventModuleByReference(eventModules: EventModule[]) {
    let referenceId = this.questionnaireReference.split("/")[1];
    this.eventModule = eventModules.find(eventModule => eventModule.fhirId === referenceId);
  }

  fhirId: string;
  questionnaireReference: string;
  items: EventItem[];
  eventModule?: EventModule;
}
