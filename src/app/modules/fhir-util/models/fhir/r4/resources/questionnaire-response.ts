import {DomainResource} from "../base/fhir.domain-resource";
import {QuestionnaireResponseStatus} from "../value-sets/questionnaire-response-status";
import {Identifier} from "../types/identifier";
import {Reference} from "../types/reference";
import {BackboneElement} from "../base/fhir.backbone-element";
import {Coding} from "../types/coding";

export class QuestionnaireResponse implements DomainResource {
  resourceType: string = "QuestionnaireResponse";
  id?: string;
  identifier?: Identifier; // 0..1
  basedOn?: Reference[]; // 0..*
  partOf?: Reference[]; // 0..*
  questionnaire?: string; // canonical 0..1
  status: QuestionnaireResponseStatus; // 1..1
  subject?: Reference; // 0..1
  encounter?: Reference; // 0..1
  authored?: string; // dateTime 0..1
  author?: Reference; // 0..1
  source?: Reference; // 0..1
  item: QuestionnaireResponseItem[]; // 0..*
}

export class QuestionnaireResponseItem extends BackboneElement {
  linkId: string; // 1..1
  definition?: string; // uri 0..1
  text?: string; // 0..1
  answer?: QuestionnaireResponseItemAnswer[]; // 0..*
  item?: QuestionnaireResponseItem[]; // 0..*
}

export class QuestionnaireResponseItemAnswer extends BackboneElement {
  // value[x] 0..1 - Choice of Data Type
  valueCoding?: Coding;
  valueReference?: Reference;

  // Recursive item.
  item?: QuestionnaireResponseItem[];
}
