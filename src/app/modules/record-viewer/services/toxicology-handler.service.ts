import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {EnvironmentHandlerService} from "./environment-handler.service";
import {TrackingNumberType} from "../../../model/tracking.number.type";
import { trackingNumberUrl } from "../models/mdi/tracking.number"
import {ToxHeader} from "../models/tox.header";
import {FhirHelperService} from "../../fhir-util/services/fhir-helper.service";
import {BundleHelperService} from "../../fhir-util/services/bundle-helper.service";
import {LabResult, Performer, Specimen, ToxSummary} from "../models/tox.summary";

@Injectable({
  providedIn: 'root'
})
export class ToxicologyHandlerService {

  constructor(
    private http: HttpClient,
    private environmentHandler: EnvironmentHandlerService,
    private fhirHelper: FhirHelperService,
    private bundleHelper: BundleHelperService
  ) { }

  getToxicologyRecords(): Observable<any>{
    return this.http.get(this.environmentHandler.getFhirServerBaseURL() + "DiagnosticReport?_count=100")
      .pipe( map((result: any) => {
        // By convention the API should return an empty array. However, the FHIR server we use does not.
        // We are adding an empty array to prevent NPE errors in the components using this service.
          if (!result?.entry) {
            return [];
          }
          else {
            return result.entry as Object[];
          }
        }
      ));
  }

  getSubject(diagnosticReport: any): Observable<any> {
    // NOTE: THIS REQUIRED IN THE DATA AND SHOULD NEVER BE NULL
    const subjectReference = diagnosticReport?.subject?.reference;
    let subjectId = subjectReference.split("/").pop();
    return this.http.get(this.environmentHandler.getFhirServerBaseURL() + "Patient/" + subjectId);
  }

  // This is designed for DiagnosticReport but should work for Composition as well.
  getTrackingNumber(resource: any, type: TrackingNumberType): any {
    let trackingNumber = undefined;
    const trackingNumberExtensions = resource.extension?.filter(extension => extension.url === trackingNumberUrl);
    trackingNumberExtensions.forEach(extension => {
      if (extension.valueIdentifier?.type?.coding?.[0]?.code === type) {
        trackingNumber = {
          "value": extension.valueIdentifier?.value,
          "system": extension.valueIdentifier?.system || "System Not Specified"
        }
      }
    });
    return trackingNumber;
  }

  // toxLabId is a fully qualified system|code value.
  getMessageBundle(toxLabId: string): Observable<any> {
    const parametersResource = this.createToxSearchParametersResource(toxLabId);
    return this.http.post(
      this.environmentHandler.getFhirServerBaseURL() + "DiagnosticReport/$toxicology-message",
      parametersResource
    ).pipe(
      map((searchBundle: any) => searchBundle.entry[0].resource)
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
    const diagnosticReport = messageBundle?.entry?.find(bec => bec.resource.resourceType === "DiagnosticReport").resource;
    return diagnosticReport;
  }

  constructToxHeaderHeader(messageBundle: any): ToxHeader {
    const diagnosticReport = this.getDiagnosticReportFromMessageBundle(messageBundle);
    const subject = this.bundleHelper.findSubjectInBundle(diagnosticReport, messageBundle);
    const toxLabNumber = this.getTrackingNumber(diagnosticReport, TrackingNumberType.Tox);
    let toxHeader = new ToxHeader();
    toxHeader.fullName = this.fhirHelper.getPatientOfficialName(subject);
    toxHeader.reportDate = diagnosticReport.issued.split("T")[0] || undefined;
    toxHeader.toxCaseNumber = toxLabNumber.value;
    toxHeader.toxCaseSystem = toxLabNumber.system;
    return toxHeader
  }

  constructToxSummary(messageBundle: any): ToxSummary {
    const diagnosticReport = this.getDiagnosticReportFromMessageBundle(messageBundle);
    const subject = this.bundleHelper.findSubjectInBundle(diagnosticReport, messageBundle);
    let toxSummary = new ToxSummary()
    toxSummary.patientId = subject.id; //"6951b919-1872-448c-8893-555febe22bc1";
    toxSummary.mdiCaseNumber = this.fhirHelper.getTrackingNumber(diagnosticReport, TrackingNumberType.Mdi);
    toxSummary.performers = this.createPerformersList(diagnosticReport, messageBundle);
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
          const practitionerResource = this.bundleHelper.findResourceByFullUrl(messageBundle, performer.reference);
          const performerObject = new Performer(this.fhirHelper.getPatientOfficialName(practitionerResource, 0, true), practitionerResource);
          performers.push(performerObject);
        }
      );
    }
    return performers;
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
        const specimenObject = new Specimen(type, site, identifier, collected, specimenResource);
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


    // TODO: Refactor to map to boolean
  isRelatedMdiDocumentAvailable(subjectId: any) {
    return this.http.get(this.environmentHandler.getFhirServerBaseURL() + "Composition?subject=" + subjectId).pipe(
      map((searchBundle:any) => {return !!searchBundle.entry})
    );
  }

}
