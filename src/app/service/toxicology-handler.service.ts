import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {EnvironmentHandlerService} from "./environment-handler.service";
import {TrackingNumberType} from "../model/tracking.number.type";
import {trackingNumberUrl} from "../model/fhir.constants";

@Injectable({
  providedIn: 'root'
})
export class ToxicologyHandlerService {

  constructor(
    private http: HttpClient,
    private environmentHandler: EnvironmentHandlerService
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
    console.log(trackingNumberExtensions);
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
  getMdiCaseNumber(diagnosticReport: any): any {

    return "456"
  }
}
