import {TrackingNumber} from "../mdi/tracking.number";

export class CaseHeader {
  fullName: string;
  gender: string;
  deathDate: string;
  deathTime: string;
  trackingNumbers: TrackingNumber[];
  authors: Author[];

  constructor() {
    this.authors = new Array();
    this.trackingNumbers = new Array();
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
