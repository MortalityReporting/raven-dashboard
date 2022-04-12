import { Injectable } from '@angular/core';
import {finalize, Observable, Subject, map, BehaviorSubject, generate} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DecedentService} from "./decedent.service";
import {PatientHeader} from "../model/case-summary-models/patient.header";
import {CaseSummary, CauseAndManner, Circumstances, Demographics} from "../model/case-summary-models/case.summary";
import {CaseHeader} from "../model/case-summary-models/case.header";
import {TrackingNumber} from "../model/mdi/tracking.number";
import {TerminologyHandlerService} from "./terminology-handler.service";

@Injectable({
  providedIn: 'root'
})
export class DocumentHandlerService {

  private subjectId: string;

  private patientResource = new Subject<any>();
  patientResource$ = this.patientResource.asObservable();

  private patientHeader = new Subject<PatientHeader>();
  patientHeader$ = this.patientHeader.asObservable();
  private caseHeader = new Subject<CaseHeader>();
  caseHeader$ = this.caseHeader.asObservable();
  private caseSummary = new Subject<CaseSummary>();
  caseSummary$ = this.caseSummary.asObservable();

  constructor(private http: HttpClient, private decedentService: DecedentService, private terminologyService: TerminologyHandlerService) {}

  getDocumentBundle(compositionId: string) {
    return this.http.get(this.decedentService.getFhirServerBaseURL() + "Composition/" + compositionId + "/$document").pipe(
      map((documentBundle: any) => {
        console.log(documentBundle)
        let compositionResource = this.findResourceById(documentBundle, "Composition/" + compositionId);
        this.subjectId = compositionResource.subject.reference
        let patientResource = this.findResourceById(documentBundle, this.subjectId);
        this.patientResource.next(patientResource);
        this.patientHeader.next(this.createPatientHeader(patientResource));
        this.caseHeader.next(this.createCaseHeader(compositionResource));
        this.caseSummary.next(this.createCaseSummary(documentBundle));
      })
    );
  }

  updateDocumentBundle() {

  }

  getSourceResourceByFieldId(fieldId: string) {
    return ''
  }

  // -------------------------
  // Case and Patient Header Functions
  // -------------------------

  createPatientHeader(patientResource: any): PatientHeader {
    let header = new PatientHeader();
    header.fullName = this.getPatientOfficialName(patientResource);
    let genderString = patientResource.gender || "Unknown";
    header.gender = genderString.substring(0,1).toUpperCase() + genderString.substring(1);
    header.birthDate = patientResource.birthDate || "Unknown";
    return header;
  }

  createCaseHeader(compositionResource: any): CaseHeader {
    console.log(compositionResource);
    let caseHeader = new CaseHeader();
    caseHeader.trackingNumber = this.getTrackingNumber(compositionResource);
    return caseHeader;
  }

  // -------------------------
  // Case Summary Section Functions
  // -------------------------

  createCaseSummary(documentBundle: any): CaseSummary {
    let summary: CaseSummary = new CaseSummary();
    summary.demographics = this.generateDemographics(documentBundle);
    summary.circumstances = this.generateCircumstances(documentBundle);
    summary.causeAndManner = this.generateCauseAndManner(documentBundle);
    return summary;
  }

  generateDemographics(documentBundle: any): Demographics {
    let demographics: Demographics = new Demographics();
    let patientResource = this.findResourceById(documentBundle, this.subjectId);

    // Setup Basic Demographics from Patient Resource Directly
    demographics.aliases = patientResource.name;
    demographics.gender = patientResource.gender || "Unknown";
    demographics.birthDate = patientResource.birthDate;

    // Setup Identifiers
    demographics.ssn = this.getSocialSecurityNumber(patientResource);
    demographics.identifiers = patientResource.identifier;

    // Handle Extensions
    let extensions = patientResource.extension;
    demographics.race = this.getDecedentRaceText(extensions);
    demographics.ethnicity = this.getDecedentEthnicityText(extensions);

    return demographics;
  }

  generateCircumstances(documentBundle: any): Circumstances {
    let circumstances: Circumstances = new Circumstances();

    return circumstances;
  }

  generateCauseAndManner(documentBundle: any): CauseAndManner {
    let causeAndManner: CauseAndManner = new CauseAndManner();

    return causeAndManner;
  }

  // -------------------------
  // Find and Filter Functions
  // -------------------------

  // This function should be used whenever possible to go off of absolute references to the full URL.
  findResourceById(documentBundle: any, resourceId: string) {
    let entryList = documentBundle.entry;
    let resource = (entryList.find((entry: any) => entry.fullUrl === resourceId)).resource;
    return resource;
  }

  // Filter Bundle Entries by Patient Resource.
  filterPatientResources(documentBundle: any): any {
    let entryList = documentBundle.entry;
    let patientResources = entryList.filter((entry: any) => entry.resource.resourceType === "Patient");
    return patientResources;
  }

  // -------------------------
  // Helper Functions
  // -------------------------

  getTrackingNumber(compositionResource: any): TrackingNumber {
    let trackingNumber = new TrackingNumber();
    let extensions = compositionResource.extension;
    let trackingNumberExtension = extensions.find((extension: any) => extension.url === "http://hl7.org/fhir/us/mdi/StructureDefinition/Extension-tracking-number");
    let valueIdentifier = trackingNumberExtension?.valueIdentifier;
    console.log(valueIdentifier)
    trackingNumber.value = valueIdentifier.value || "Not Specified";
    if (valueIdentifier?.type?.text) {
      trackingNumber.type = valueIdentifier.type.text;
    }
    else if (valueIdentifier.type?.coding[0].code) {
      let code = valueIdentifier.type?.coding[0].code;
      trackingNumber.type = this.terminologyService.mapMdiCodeToDisplay(code);
    }
    else {
      trackingNumber.type = "Unknown"
    }
    return trackingNumber;
  }

  getPatientOfficialName(patientResource: any): string {
    let nameList = patientResource.name;
    let firstOfficialName = (nameList.filter((humanName: any) => humanName.use === "official"))[0];
    let fullName = "";
    firstOfficialName.given.forEach((name: any) => {
      fullName = fullName + name + " "
    });
    fullName = fullName + firstOfficialName.family;
    return fullName;
  }

  getSocialSecurityNumber(patientResource: any): string {
    let identifierList = patientResource.identifier;
    let ssnIdentifier = (identifierList.filter((identifier: any) => identifier.system === "http://hl7.org/fhir/sid/us-ssn"))[0];
    return ssnIdentifier?.value || "Unknown";
  }

  getDecedentRaceText(extensions: any): string {
    // TODO: Need Test Data
    return ""
  }

  getDecedentEthnicityText(extensions: any): string {
    // TODO: Need Test Data
    return ""
  }
}
