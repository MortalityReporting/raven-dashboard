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
  resource: any;

  getFullName(): string {
    return (`${this.givenName[0] ?? ''} ${this.familyName ?? ''}`).trim();
  }

  getFullAddress(): string {
    return (`${this.line? this.line + '\n': ''}${this.city ? this.city + ', ' : ''} ${this.state ?? ''} ${this.postalCode ?? ''}`).trim();
  }
}
