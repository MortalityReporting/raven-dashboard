import {TrackingNumberExtension} from "../../fhir-mdi-library";

export class CaseHeader {
  fullName: string;
  gender: string;
  trackingNumbers: TrackingNumberExtension[];
  authors: Author[];
  mdiCaseNumber: TrackingNumberExtension;
  deathDateTime: string;

  constructor() {
    this.authors = [];
    this.trackingNumbers = [];
  }
}

export class Author {
  license: string;
  familyName: string;
  givenName: string;
  phoneNumber: string;
  line: string;
  city: string;
  state: string;
  postalCode: string;
}
