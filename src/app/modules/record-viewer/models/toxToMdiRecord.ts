import {ToxHeader} from "./tox.header";
import {ToxSummary} from "./tox.summary";
import {Bundle} from "../../fhir-util";

export class ToxToMdiRecord {
  constructor(toxHeader, toxSummary, toxLabId, mdiCaseNumber, messageBundle) {
    this.toxHeader = toxHeader;
    this.toxSummary = toxSummary;
    this.toxLabId = toxLabId;
    this.mdiCaseNumber = mdiCaseNumber;
    this.messageBundle = messageBundle;
  }

  toxHeader: ToxHeader;
  toxSummary: ToxSummary;
  toxLabId: string;
  mdiCaseNumber: string;
  messageBundle: Bundle;
}
