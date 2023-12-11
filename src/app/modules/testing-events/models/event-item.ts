import {
  QuestionnaireResponseItem,
} from "../../fhir-util";
import {TestStatusCodes, TestStatusDictionary, TestStatusReverseLookUp, TestStatusSystem} from "./test-status";

export class EventItem {
  constructor(item: any) {
    this.linkId = item.linkId;
    this.name = item.text;
    this.code = item.code[0].code;
    //if (item)
  }

  setStatus(status: TestStatusCodes) {
    this.status = status;
  }

  // Should be a FHIR Reference.
  setAttachment(attachment: string) {
    this.attachment = attachment;
  }

  name: string;
  linkId: string;
  code: string;
  status?: TestStatusCodes;
  attachment?: any;

  // Convert to QuestionnaireResponseItem. QuestionnaireItem is handled manually.
  toFhir(): QuestionnaireResponseItem {
    let item = new QuestionnaireResponseItem()
    item.linkId = this.linkId;
    item.text = this.name;
    item.answer = [];
    const code = TestStatusReverseLookUp(this.status);
    item.answer.push({
      "valueCoding": {
        "system": TestStatusSystem,
        "code": code
      }
    });
    if (this.attachment) {
      item.answer.push({
        "valueReference": {
          "reference": this.attachment
        }
      })
    }
    return item;
  }
}
