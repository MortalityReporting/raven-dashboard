import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from  "rxjs/operators";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DecedentService {

  constructor(private http: HttpClient) { }

  getDecedentConditionRecords(decedent: any):  Observable<any> {
    // Headers are added in the FHIR Auth Interceptor
    return this.http.get(this.getFhirServerBaseURL() + "Observation?patient=" + decedent.resource.id + "&code=81956-5").pipe( map((result: any) => result));
  }
  getDecedentRecords():  Observable<any> {
    // Headers are added in the FHIR Auth Interceptor
    return this.http.get(this.getFhirServerBaseURL() + "Patient").pipe( map((result: any) => (
      result.entry as Object[]
    )));
  }

  getFhirServerBaseURL(): string {
    let ravenFhirServer = environment.ravenFhirServer;
    if (!ravenFhirServer.endsWith("/")) {
      ravenFhirServer = ravenFhirServer.concat("/");
    }
    return ravenFhirServer;
  }

}
