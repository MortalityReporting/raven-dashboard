import {Address, Bundle, FhirResource} from "../../fhir-util";
import {Demographics} from "./case.summary";

export interface DrcRecord {
  resource: Bundle;
  dcrSummary: DcrSummary;
  dcrGridDTO: DcrGridDTO;
}

export interface FuneralHome {
  name: string;
  address: Address;
}

export interface CaseAdminInfo {
  name: string;
  signature: string;
  resource: FhirResource;
}

export interface CremationClearanceInfo {
  resource: FhirResource;
  funeralHome: FuneralHome;
}

export interface PlaceOfDeath {
  type: string;
  address: Address;
  facility: any;
  facilityName: string;
  resource: FhirResource;
}

export interface DeathInvestigation{
  resource: FhirResource;
  dateTimeOfDeath: Date;
  type: string;
  placeOfDeath: PlaceOfDeath;
}

export interface DcrHeader {
  fullName: string;
  reportDate: string;
  dcrCaseNumber: string;
  dcrCaseSystem: string;
}

export interface DcrGridDTO {
  firstName: string;
  lastName: string;
  gender: string;
  mdiCaseNumber: string;
  deathDate: string;
  recordId: string;
}

export interface DcrSummary {
  caseAdminInfo: CaseAdminInfo;
  dcrHeader: DcrHeader;
  demographics: Demographics;
  deathInvestigation: DeathInvestigation;
  cremationClearanceInfo: CremationClearanceInfo;
  placeOfDeath: PlaceOfDeath;
}
