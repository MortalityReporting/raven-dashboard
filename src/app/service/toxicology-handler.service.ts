import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, tap} from "rxjs";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {EnvironmentHandlerService} from "./environment-handler.service";
import {TrackingNumberType} from "../model/tracking.number.type";
import {trackingNumberUrl} from "../model/fhir.constants";
import {ToxHeader} from "../model/tox-report-models/tox.header";
import {FhirHelperService} from "./fhir/fhir-helper.service";
import {BundleHelperService} from "./fhir/bundle-helper.service";

@Injectable({
  providedIn: 'root'
})
export class ToxicologyHandlerService {

  private toxHeader: BehaviorSubject<ToxHeader> = new BehaviorSubject<ToxHeader>(undefined);
  toxHeader$ = this.toxHeader.asObservable();

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
      map((searchBundle: any) => searchBundle.entry[0].resource),
      tap(messageBundle => this.setToxHeaderHeader(messageBundle))
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

  setToxHeaderHeader(messageBundle: any) {
    const diagnosticReport = this.getDiagnosticReportFromMessageBundle(messageBundle);
    const subject = this.bundleHelper.findSubjectInBundle(diagnosticReport, messageBundle);
    const toxLabNumber = this.getTrackingNumber(diagnosticReport, TrackingNumberType.Tox);
    console.log(diagnosticReport.issued);
    let toxHeader = new ToxHeader();
    toxHeader.fullName = this.fhirHelper.getPatientOfficialName(subject);
    toxHeader.reportDate = diagnosticReport.issued.split("T")[0] || undefined;
    toxHeader.toxCaseNumber = toxLabNumber.value;
    toxHeader.toxCaseSystem = toxLabNumber.system;
    this.toxHeader.next(toxHeader)
  }

}
