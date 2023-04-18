import {TrackingNumber} from "./mdi/tracking.number";

export class CaseHeader {
  fullName: string;
  gender: string;
  trackingNumbers: TrackingNumber[];
  authors: Author[];
  mdiCaseNumber: TrackingNumber;
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
