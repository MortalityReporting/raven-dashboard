export class ToxSummary {
  patientId: string;
  mdiCaseNumber: string;
  performers: Performer[];
  specimens: Specimen[];
  results: Lab[];
  conclusion: string;
}

export class Performer {
  name: string;
}

export class Specimen {

}

export class Lab {

}
