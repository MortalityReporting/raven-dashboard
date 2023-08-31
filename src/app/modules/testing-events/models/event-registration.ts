import {Coding, FhirResource} from "../../fhir-util";
import {EventModule} from "./event-module";
import {EventItem} from "./event-item";
import {QuestionnaireResponse, QuestionnaireResponseItem} from "../../fhir-util/models/fhir/r4/resources/questionnaire-response";
import {QuestionnaireResponseStatus} from "../../fhir-util/models/fhir/r4/value-sets/questionnaire-response-status";
import {Reference} from "../../fhir-util/models/fhir/r4/types/reference";

export class EventRegistration {
  constructor() {
    this.fhirId = "";
  }

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


  static createFhirResource(event: EventModule, subjectReference: string): QuestionnaireResponse {
    const notStartedCoding = new Coding()
    notStartedCoding.system = "https://raven.dev.heat.icl.gtri.org/mdi-fhir-server/fhir/CodeSystem/624454";
    notStartedCoding.code = "not-started";
    // TODO: Add error handling if not all fields exist.
    let questionnaireResponse = new QuestionnaireResponse();
    questionnaireResponse.questionnaire = `Questionnaire/${event.fhirId}`;
    questionnaireResponse.status = QuestionnaireResponseStatus.inProgress;
    questionnaireResponse.subject = new Reference(subjectReference);
    questionnaireResponse.item = [];
    event.items.forEach((eventItem: EventItem) => {
      let item = new QuestionnaireResponseItem();
      item.linkId = eventItem.linkId;
      item.answer = [{"valueCoding": notStartedCoding}];
      questionnaireResponse.item.push(item);
    })
    return questionnaireResponse;
  }

  toFhir(): QuestionnaireResponse {
    let questionnaireResponse = new QuestionnaireResponse();
    questionnaireResponse.id = this.fhirId;
    questionnaireResponse.questionnaire = this.questionnaireReference;
    questionnaireResponse.item = [];
    this.items.forEach((item: EventItem) => {
      questionnaireResponse.item.push(item.toFhir())
    });
    console.log(questionnaireResponse)
    return questionnaireResponse;
  }
}
