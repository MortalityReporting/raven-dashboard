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
  addressText: string;
}

export interface CaseAdminInfo {
  name: string;
  email: string;
  resource: FhirResource;
}

export interface CremationClearanceInfo {
  resource: FhirResource;
  funeralHome: FuneralHome;
}

export interface PlaceOfDeath {
  type: string;
  address: Address;
  addressText: string;
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
}

export interface DcrGridDTO {
  firstName: string;
  lastName: string;
  // TODO uncomment when we know how to use gender/sex fields per the CDC guidelines. Note that gender should come from Sex at Death
  // gender: string;
  deathDate: string;
  recordId: string;
  funeralHomeName: string;
}

export interface SignedBy{
  resource: FhirResource;
  name: string;
}

export interface SignatureBlock{
  fileFormat: string;
  dateTime: string;
  signatureStr:string;
  resource: FhirResource;
  signedBy: SignedBy;
}

export interface DcrSummary {
  caseAdminInfo: CaseAdminInfo;
  dcrHeader: DcrHeader;
  demographics: Demographics;
  deathInvestigation: DeathInvestigation;
  cremationClearanceInfo: CremationClearanceInfo;
  placeOfDeath: PlaceOfDeath;
  signatureBlock: SignatureBlock;
}
