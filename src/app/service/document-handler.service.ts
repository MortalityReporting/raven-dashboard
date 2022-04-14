import { Injectable } from '@angular/core';
import { Subject, map } from "rxjs";
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
        this.caseSummary.next(this.createCaseSummary(documentBundle, patientResource, compositionResource));
      })
    );
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

  createCaseSummary(documentBundle: any, patientResource: any, compositionResource: any): CaseSummary {
    let summary: CaseSummary = new CaseSummary();
    summary.demographics = this.generateDemographics(documentBundle, patientResource);
    summary.circumstances = this.generateCircumstances(documentBundle, compositionResource);
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

  generateCircumstances(documentBundle: any, compositionResource: any): Circumstances {
    let circumstances: Circumstances = new Circumstances();
    circumstances.workInjury = "" // TODO: Missing data, once available fix.
    circumstances.pregnancy = "" // TODO: Missing data, once available fix.
    circumstances.tobaccoUseContributed = "" // TODO: Missing data, once available fix.

    let deathLocationResource = this.findDeathLocation(documentBundle, compositionResource);
    circumstances.deathLocation = deathLocationResource.name || "Unknown" // TODO: Missing data, once available fix.
    return circumstances;
  }

  generateCauseAndManner(documentBundle: any): CauseAndManner {
    let causeAndManner: CauseAndManner = new CauseAndManner();

    return causeAndManner;
  }

  // -------------------------
  // Find and Filter Functions
  // -------------------------

  // This function should be used whenever possible to go off of absolute references to the full URL within the Document Bundle.
  findResourceById(documentBundle: any, resourceId: string): any {
    return (documentBundle.entry.find((entry: any) => entry.fullUrl === resourceId)).resource;
  }

  // Find Death Date Profile (singleton) by profile name.
  findDeathDate(documentBundle: any): any {
    return documentBundle.entry.find((entry: any) => entry.resource.meta.profile.includes("http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-death-date")).resource;
  }

  // Find Death Location Resource (US Core Location Profile) through the Composition.section reference.
  findDeathLocation(documentBundle: any, compositionResource: any): any {
    let circumstancesSection = compositionResource.section.find((section: any) => section.code.coding.some((coding: any) => coding.code === "circumstances"));
    let deathLocationResourceId = (circumstancesSection.entry.find((entry: any) => entry.reference.startsWith("Location"))).reference;
    let deathLocationResource = this.findResourceById(documentBundle, deathLocationResourceId);
    // TODO: Add handling for reference from death date?
    return deathLocationResource;
  }

  // Filter Bundle Entries by Patient Resource.
  filterPatientResources(documentBundle: any): any {
    return documentBundle.entry.filter((entry: any) => entry.resource.resourceType === "Patient");
  }

  // Filter Bundle Entries by Observation Resource.
  filterObservationResources(documentBundle: any): any {
    return documentBundle.entry.filter((entry: any) => entry.resource.resourceType === "Observation");
  }

  // -------------------------
  // Helper Functions
  // -------------------------

  // Get Tracking Number from Composition Extension
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

  // Build a full name from Patient official use name
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

  // Get SSN from Patient Identifier
  getSocialSecurityNumber(patientResource: any): string {
    let identifierList = patientResource.identifier;
    let ssnIdentifier = (identifierList.filter((identifier: any) => identifier.system === "http://hl7.org/fhir/sid/us-ssn"))[0];
    return ssnIdentifier?.value || "Unknown";
  }

  // Get Race Text from Patient Extension
  getDecedentRaceText(extensions: any): string {
    let raceExtension = extensions.find((extension: any) => extension.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race");
    let textExtension = raceExtension?.extension?.find((extension: any) => extension.url === "text");
    return textExtension?.valueString || "Unknown";
  }

  // Get Ethnicity Text from Patient Extension
  getDecedentEthnicityText(extensions: any): string {
    let ethnicityExtension = extensions.find((extension: any) => extension.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity");
    let textExtension = ethnicityExtension?.extension?.find((extension: any) => extension.url === "text");
    return textExtension?.valueString || "Unknown";
  }

  // Get Death Location
  getDeathLocation(documentBundle: any): string {
    // TODO:
    return ""
  }
}
