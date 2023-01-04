import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {EnvironmentHandlerService} from "./environment-handler.service";
import {TrackingNumberType} from "../model/tracking.number.type";
import {trackingNumberUrl} from "../model/fhir.constants";
import {ToxHeader} from "../model/record-models/tox.header";
import {FhirHelperService} from "./fhir/fhir-helper.service";
import {BundleHelperService} from "./fhir/bundle-helper.service";
import {Performer, ToxSummary} from "../model/record-models/tox.summary";

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
      .pipe( map((result: any) => (
        result.entry as Object[]
      )));
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
    console.log(diagnosticReport.issued);
    let toxHeader = new ToxHeader();
    toxHeader.fullName = this.fhirHelper.getPatientOfficialName(subject);
    toxHeader.reportDate = diagnosticReport.issued.split("T")[0] || undefined;
    toxHeader.toxCaseNumber = toxLabNumber.value;
    toxHeader.toxCaseSystem = toxLabNumber.system;
    return toxHeader
  }

  constructToxSummary(messageBundle: any): ToxSummary {
    let toxSummary = new ToxSummary()
    const diagnosticReport = this.getDiagnosticReportFromMessageBundle(messageBundle);
    const subject = this.bundleHelper.findSubjectInBundle(diagnosticReport, messageBundle);
    toxSummary.patientId = subject.id //"6951b919-1872-448c-8893-555febe22bc1";
    toxSummary.mdiCaseNumber = this.fhirHelper.getTrackingNumber(diagnosticReport, TrackingNumberType.Mdi);


    toxSummary.performers = this.createPerformersList(diagnosticReport, messageBundle);

    console.log(toxSummary)
    return toxSummary
  }

  // TODO: Add support for non references.
  createPerformersList(diagnosticReport: any, messageBundle: any): Performer[] {
    let performers = [];
    if (diagnosticReport.performer) {
      diagnosticReport.performer.forEach(performer => console.log(performer));
    }
    return performers;
  }


  // TODO: Refactor to map to boolean
  isRelatedMdiDocumentAvailable(subjectId: any) {
    return this.http.get(this.environmentHandler.getFhirServerBaseURL() + "Composition?subject=" + subjectId).pipe(
      map((searchBundle:any) => {return !!searchBundle.entry})
    );
  }

}
