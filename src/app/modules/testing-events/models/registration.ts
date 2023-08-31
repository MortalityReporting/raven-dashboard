import {
  Coding,
  QuestionnaireResponse,
  QuestionnaireResponseItem,
  QuestionnaireResponseItemAnswer
} from "../../fhir-util";
import {TestStatus} from "./test-status";
import {Reference} from "../../fhir-util/models/fhir/r4/types/reference";
import {EventModule} from "./event-module";
import {QuestionnaireResponseStatus} from "../../fhir-util/models/fhir/r4/value-sets/questionnaire-response-status";
import {EventItem} from "./event-item";


export class Registration extends QuestionnaireResponse {

  constructor(event: EventModule, subjectReference: string) {
    super();
    const notStartedCoding = new Coding();
    notStartedCoding.system = "https://raven.dev.heat.icl.gtri.org/mdi-fhir-server/fhir/CodeSystem/624454";
    notStartedCoding.code = "not-started";
    // TODO: Add error handling if not all fields exist.
    this.questionnaire = `Questionnaire/${event.fhirId}`;
    this.status = QuestionnaireResponseStatus.inProgress;
    this.subject = new Reference(subjectReference);
    this.item = [];
    event.items.forEach((eventItem: EventItem) => {
      let item = new QuestionnaireResponseItem();
      item.linkId = eventItem.linkId;
      item.answer = [{"valueCoding": notStartedCoding}];
      this.item.push(item);
    })
  }

  getTitle(eventList: EventModule[]): string {
    const event = eventList.find((event: EventModule) => this.questionnaire.endsWith(event.fhirId));
    return event.title;
  }

  updateStatus(linkId: string, newStatus: TestStatus, attachmentId?: string) {
    let item: QuestionnaireResponseItem = this.item.find( item => item.linkId === linkId);
    item.answer[0].valueCoding.code = newStatus;
    if (attachmentId) {
      let attachmentAnswer: QuestionnaireResponseItemAnswer = {
        valueReference: new Reference(`DocumentReference/${attachmentId}`)
      }
      item.answer.push(attachmentAnswer);
    }
  }
}
