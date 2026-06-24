import {CaseHeader} from "./case.header";
import {CaseSummary} from "./case.summary";

export class MdiToEdrsRecord {
  constructor(caseHeader, caseSummary, compositionId, mdiCaseNumber, documentBundle, relatedToxicology) {
    this.caseHeader = caseHeader;
    this.caseSummary = caseSummary;
    this.compositionId = compositionId;
    this.mdiCaseNumber = mdiCaseNumber;
    this.documentBundle = documentBundle;
    this.relatedToxicology = relatedToxicology;
  }

  caseHeader: CaseHeader;
  caseSummary: CaseSummary;
  compositionId: string;
  mdiCaseNumber: string;
  documentBundle: any;
  relatedToxicology: any[];
}
