import {TrackingNumber} from "../mdi/tracking.number";

export class CaseHeader {
  fullName: string;
  gender: string;
  deathDate: string;
  deathTime: string;
  trackingNumber: TrackingNumber;
  authors: string[];

  constructor() {
    this.authors = new Array();
  }
}
