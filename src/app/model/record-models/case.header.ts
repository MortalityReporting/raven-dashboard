import {TrackingNumber} from "../mdi/tracking.number";

export class CaseHeader {
  fullName: string;
  gender: string;
  deathDate: string;
  deathTime: string;
  trackingNumbers: TrackingNumber[];
  authors: Author[];
  mdiCaseNumber: TrackingNumber;

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
