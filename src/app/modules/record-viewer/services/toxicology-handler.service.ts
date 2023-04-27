import {Injectable} from '@angular/core';
import {Observable, skipWhile, tap} from "rxjs";
import {map} from "rxjs/operators";
import {EnvironmentHandlerService} from "../../fhir-util";
import {TrackingNumberType} from "../../../model/tracking.number.type";
import {trackingNumberUrl} from "../models/mdi/tracking.number"
import {ToxHeader} from "../models/tox.header";
import {FhirHelperService} from "../../fhir-util";
import {BundleHelperService} from "../../fhir-util";
import {CertifierAndOrganization, LabResult, Performer, Specimen, ToxSummary} from "../models/tox.summary";
import {FhirClientService} from "../../fhir-util";
import {FhirResource} from "../../fhir-util";
import {Address} from "../../fhir-util";

@Injectable({
  providedIn: 'root'
})
export class ToxicologyHandlerService {

  constructor(
    private fhirClient: FhirClientService,
    private environmentHandler: EnvironmentHandlerService,
    private fhirHelper: FhirHelperService,
    private bundleHelper: BundleHelperService
  ) { }

  getToxicologyRecords(): Observable<any>{
    return this.fhirClient.search("DiagnosticReport", "", true).pipe(
      tap(console.log),
      skipWhile((result: any) => {
        return !result
      })
    );
  }

  getSubject(diagnosticReport: any): Observable<any> {
    // NOTE: THIS REQUIRED IN THE DATA AND SHOULD NEVER BE NULL
    console.log(diagnosticReport);
    const subjectReference = diagnosticReport?.subject?.reference;
    let subjectId = subjectReference.split("/").pop();
    return this.fhirClient.read("Patient", subjectId);
  }

  // This is designed for DiagnosticReport but should work for Composition as well.
  getTrackingNumber(resource: any, type: TrackingNumberType): any {
    let trackingNumber = undefined;
    const trackingNumberExtensions = resource.extension?.filter(extension => extension.url === trackingNumberUrl);

    if (!trackingNumberExtensions) {
      console.error(`${resource.resourceType}/${resource.id} is missing ${type} extension.`);
      return undefined;
    }
    else {
      trackingNumberExtensions.forEach(extension => {
        if (extension.valueIdentifier?.type?.coding?.[0]?.code === type) {
          const value = extension.valueIdentifier?.value || undefined;
          const system = extension.valueIdentifier?.system || undefined;

          if (!value) console.error(`${resource.resourceType}/${resource.id} is missing element 'value' in ${type} extension.`);
          if (!system) console.error(`${resource.resourceType}/${resource.id} is missing element 'system' in ${type} extension.`);

          trackingNumber = {
            "value": value,
            "system": system
          }
        }
      });
      return trackingNumber;
    }
  }

  // toxLabId is a fully qualified system|code value.
  getMessageBundle(toxLabId: string): Observable<any> {
    const parametersResource: FhirResource = this.createToxSearchParametersResource(toxLabId);
    return this.fhirClient.search(
      "DiagnosticReport/$toxicology-message",
      parametersResource
    ).pipe(
      map((searchBundle: any) => searchBundle?.entry?.[0]?.resource)
    );
  }

  createToxSearchParametersResource(toxLabId: string): any {
    return {
      "resourceType": "Parameters",
      "parameter": [
        {
          "name": "tox-lab-case-number",
          "valueString": toxLabId
        }
      ]
    }
  }

  getDiagnosticReportFromMessageBundle(messageBundle: any): any {
    return messageBundle?.entry?.find(bec => bec.resource.resourceType === "DiagnosticReport").resource;
  }

  constructToxHeaderHeader(messageBundle: any): ToxHeader {
    const diagnosticReport = this.getDiagnosticReportFromMessageBundle(messageBundle);
    const subject = this.bundleHelper.findSubjectInBundle(diagnosticReport, messageBundle);
    const toxLabNumber = this.getTrackingNumber(diagnosticReport, TrackingNumberType.Tox);
    let toxHeader = new ToxHeader();
    toxHeader.fullName = this.fhirHelper.getOfficialName(subject);
    toxHeader.reportDate = diagnosticReport.issued.split("T")[0] || undefined;
    toxHeader.toxCaseNumber = toxLabNumber.value;
    toxHeader.toxCaseSystem = toxLabNumber.system;
    return toxHeader
  }

  constructToxSummary(messageBundle: any): ToxSummary {
    const diagnosticReport = this.getDiagnosticReportFromMessageBundle(messageBundle);
    const subject = this.bundleHelper.findSubjectInBundle(diagnosticReport, messageBundle);
    let toxSummary = new ToxSummary()
    toxSummary.patientId = subject.id;
    toxSummary.mdiCaseNumber = this.fhirHelper.getTrackingNumber(diagnosticReport, TrackingNumberType.Mdi);
    toxSummary.performers = this.createPerformersList(diagnosticReport, messageBundle);
    toxSummary.certifier = this.createCertifier(toxSummary.performers[0], diagnosticReport, messageBundle);
    toxSummary.specimens = this.createSpecimenList(diagnosticReport, messageBundle);
    toxSummary.results = this.createLabResultList(diagnosticReport, messageBundle);
    toxSummary.conclusion = diagnosticReport.conclusion || undefined;
    toxSummary.diagnosticReportResource = diagnosticReport;
    return toxSummary
  }

  // TODO: Add support for non references.
  createPerformersList(diagnosticReport: any, messageBundle: any): Performer[] {
    let performers = [];
    if (diagnosticReport.performer) {
      diagnosticReport.performer.forEach(performer => {
        const performerResource = this.bundleHelper.findResourceByFullUrl(messageBundle, performer.reference);
        let performerObject: Performer;
          if (performerResource.resourceType === "Practitioner") {
            performerObject = new Performer(this.fhirHelper.getOfficialName(performerResource, 0, true), performerResource);
          }
          else if (performerResource.resourceType === "PractitionerRole") {
            const practitionerResource = this.bundleHelper.findResourceByFullUrl(messageBundle, performerResource.practitioner.reference);
            performerObject = new Performer(this.fhirHelper.getOfficialName(practitionerResource, 0, true), practitionerResource);
          }
          if (performerObject) performers.push(performerObject);
        }
      );
    }
    return performers;
  }

  createCertifier(certifier: Performer, diagnosticReport: any, messageBundle: any): CertifierAndOrganization {
    const firstPerformerReference = diagnosticReport?.performer?.[0]?.reference;
    const firstPerformerResource = this.bundleHelper.findResourceByFullUrl(messageBundle, firstPerformerReference);

    let certifierAndOrganization: CertifierAndOrganization;
    if (firstPerformerResource?.resourceType === "PractitionerRole") {
      const organizationResource: FhirResource = this.bundleHelper.findResourceByFullUrl(messageBundle, firstPerformerResource?.organization?.reference);
      const organizationName: string = organizationResource?.['name'];
      const organizationAddress: Address = new Address(organizationResource);
      certifierAndOrganization = new CertifierAndOrganization(certifier, organizationName, organizationAddress.toString(), organizationResource);
    }
    else {
      certifierAndOrganization = new CertifierAndOrganization(certifier);
    }
    return certifierAndOrganization;
  }

  createSpecimenList(diagnosticReport: any, messageBundle: any): Specimen[] {
    let specimens = [];
    if (diagnosticReport.specimen) {
      diagnosticReport.specimen.forEach(specimen => {
        const specimenResource = this.bundleHelper.findResourceByFullUrl(messageBundle, specimen.reference);
        const type = specimenResource.type?.text; // TODO: Add additional handling for other potential paths. Type is not optional.
        const site = specimenResource.collection?.bodySite?.text || specimenResource.collection?.bodySite?.coding?.[0]?.display || ""; // TODO: Add handling for other paths once test data available.
        const identifier = specimenResource?.accessionIdentifier?.value || ""; // TODO: Confirm this is only source of identifier to use.
        const collected = specimenResource?.collection?.collectedDateTime || ""; // TODO: Add additional handling for other potential paths.
        const received = specimenResource?.receivedTime || ""; // TODO: See above.
        const condition = specimenResource?.condition?.[0].text || specimenResource?.condition?.[0].coding?.[0]?.display || ""; // TODO: See above.
        const container = specimenResource?.container?.identifier || "";
        const note = specimenResource?.container?.note || "";
        const specimenObject = new Specimen(
          type, site, identifier, collected,
          received, condition, container, note,
          specimenResource
        );
        specimens.push(specimenObject);
      })
    }
    return specimens
  }

  createLabResultList(diagnosticReport: any, messageBundle: any): LabResult[] {
    let results = [];
    if (diagnosticReport.result) {
      diagnosticReport.result.forEach(result => {
        const observationResource = this.bundleHelper.findResourceByFullUrl(messageBundle, result.reference);
        const testType = observationResource.code?.text || ""; // TODO: Add handling for more varied data, e.g. concept display.
        const value = observationResource.valueString || ""; // TODO: Add handling for other value types.
        const date = observationResource.effectiveDateTime; // TODO: Confirm this is the appropriate date field/add handling for other date fields.
        const specimenResource = this.bundleHelper.findResourceByFullUrl(messageBundle, observationResource?.specimen?.reference);
        const specimenType = specimenResource?.type?.text; // TODO: Add additionl handling for other potential paths. Combine with common code in Specimen object.
        const labObject = new LabResult(testType, value, date, specimenType, observationResource);
        results.push(labObject);
      })
    }
    return results;
  }

  isRelatedMdiDocumentAvailable(mdiCaseNumber: any) {
    return this.fhirClient.search("Composition", `?mdi-case-number=${mdiCaseNumber}`).pipe(
      map((searchBundle:any) => {
        return searchBundle?.entry?.[0]?.resource?.subject?.reference
      })
    );
  }

}
