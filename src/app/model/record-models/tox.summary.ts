import {FhirHelperService} from "../../service/fhir/fhir-helper.service";

export class ToxSummary {
  patientId: string;
  mdiCaseNumber: string;
  performers: Performer[];
  specimens: Specimen[];
  results: LabResult[];
  conclusion: string;
}

export class Performer {
  constructor(name: string, practitionerResource: any) {
    this.name = name;
    this.resource = practitionerResource;
  }
  name: string;
  resource: any;
}

export class Specimen {
  constructor(type: string, bodysite: string, identifier: string, collected: string, specimenResource: any) {
    this.type = type;
    this.site = bodysite;
    this.identifier = identifier;
    this.collected = collected;
    this.resource = specimenResource;
  }
  type: string;
  site: string;
  identifier: string;
  collected: string;
  resource: any;
}

export class LabResult {
  constructor(test: string, value: string, date: string, specimen: string, observationResource: any) {
    this.test = test;
    this.value = value;
    this.date = date;
    this.specimen = specimen;
    this.resource = observationResource;
  }
  test: string;
  value: string; // TODO: Add additional value types.
  date: string;
  specimen: string;
  resource: any;
}
