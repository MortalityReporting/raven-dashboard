import { Injectable } from '@angular/core';
import {finalize, Observable, Subject, map, BehaviorSubject, generate} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DecedentService} from "./decedent.service";
import {CaseSummary, CauseAndManner, Circumstances, Demographics} from "../model/case-summary-models/case.summary";
import {CaseHeader} from "../model/case-summary-models/case.header";
import {TrackingNumber} from "../model/mdi/tracking.number";
import {TerminologyHandlerService} from "./terminology-handler.service";

@Injectable({
  providedIn: 'root'
})
export class DocumentHandlerService {

  private subjectId: string;

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
        this.caseHeader.next(this.createCaseHeader(documentBundle, patientResource, compositionResource));
        this.caseSummary.next(this.createCaseSummary(documentBundle, patientResource));
      })
    );
  }

  updateDocumentBundle() {

  }

  getSourceResourceByFieldId(fieldId: string) {
    return ''
  }

  // -------------------------
  // Case Header Functions
  // -------------------------

  createCaseHeader(documentBundle: any, patientResource: any, compositionResource: any): CaseHeader {
    let caseHeader = new CaseHeader();
    caseHeader.fullName = this.getPatientOfficialName(patientResource);
    let genderString = patientResource.gender || "Unknown";
    caseHeader.gender = genderString.substring(0,1).toUpperCase() + genderString.substring(1);
    let deathDateResource = this.findDeathDate(documentBundle);
    caseHeader.deathDate = deathDateResource.valueDateTime || "Unknown";
    caseHeader.trackingNumber = this.getTrackingNumber(compositionResource);
    return caseHeader;
  }

  // -------------------------
  // Case Summary Section Functions
  // -------------------------

  createCaseSummary(documentBundle: any, patientResource: any): CaseSummary {
    let summary: CaseSummary = new CaseSummary();
    summary.demographics = this.generateDemographics(documentBundle, patientResource);
    summary.circumstances = this.generateCircumstances(documentBundle);
    summary.causeAndManner = this.generateCauseAndManner(documentBundle);
    return summary;
  }

  generateDemographics(documentBundle: any, patientResource: any): Demographics {
    let demographics: Demographics = new Demographics();

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
  findResourceById(documentBundle: any, resourceId: string): any {
    return (documentBundle.entry.find((entry: any) => entry.fullUrl === resourceId)).resource;
  }

  findDeathDate(documentBundle: any): any {
    return documentBundle.entry.find((entry: any) => entry.resource.meta.profile.includes("http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-death-date")).resource;
  }

  // Filter Bundle Entries by Patient Resource.
  filterPatientResources(documentBundle: any): any {
    return documentBundle.entry.filter((entry: any) => entry.resource.resourceType === "Patient");
  }

  // -------------------------
  // Helper Functions
  // -------------------------

  getTrackingNumber(compositionResource: any): TrackingNumber {
    let trackingNumber = new TrackingNumber();
    let extensions = compositionResource.extension;
    let trackingNumberExtension = extensions.find((extension: any) => extension.url === "http://hl7.org/fhir/us/mdi/StructureDefinition/Extension-tracking-number");
    let valueIdentifier = trackingNumberExtension?.valueIdentifier;
    trackingNumber.value = valueIdentifier.value || "Tracking Number Not Specified";

    if (valueIdentifier?.type?.text) {
      trackingNumber.type = valueIdentifier.type.text;
    }
    else if (valueIdentifier.type?.coding[0].code) {
      let code = valueIdentifier.type?.coding[0].code;
      trackingNumber.type = this.terminologyService.mapMdiCodeToDisplay(code);
    }
    else {
      trackingNumber.type = "Unknown Type"
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
    let raceExtension = extensions.find((extension: any) => extension.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race");
    let textExtension = raceExtension?.extension?.find((extension: any) => extension.url === "text");
    return textExtension?.valueString || "Unknown";
  }

  getDecedentEthnicityText(extensions: any): string {
    let ethnicityExtension = extensions.find((extension: any) => extension.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity");
    let textExtension = ethnicityExtension?.extension?.find((extension: any) => extension.url === "text");
    return textExtension?.valueString || "Unknown";
  }
}
