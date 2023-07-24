import {DomainResource} from "../base/fhir.domainresource";
import {QuestionnaireResponseStatus} from "../value-sets/questionnaire-response-status";

export class QuestionnaireResponse implements DomainResource {
  resourceType: string = "QuestionnaireResponse";
  status: QuestionnaireResponseStatus;
  item: QuestionnaireResponseItem[];
}

export class QuestionnaireResponseItem {

}
