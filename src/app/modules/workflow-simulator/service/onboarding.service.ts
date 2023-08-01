import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {map} from "rxjs/operators";
import {OnboardingHttpRequest} from "../model/onboarding-http-request";
import {RequestType} from "../model/request-type";

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  constructor( private http:HttpClient) { }

  // Example url for basic auth testing
  // https://raven.dev.heat.icl.gtri.org/mdi-fhir-server/fhir/Patient
  onLogin(request: OnboardingHttpRequest): Observable<any> {
    if (request.requestType == RequestType.GET) {
      return this.http.get(request.url, request.httpOptions)
        .pipe(map(response => {
            return response;
          }),
        )

    } else if (request.requestType == RequestType.PUT) {
      return this.http.put(request.url, request.requestBody, request.httpOptions)
        .pipe(map(response => {
            return response;
          }),
        )
    } else if (request.requestType == RequestType.POST) {
      return this.http.post(request.url, request.requestBody, request.httpOptions)
        .pipe(map(response => {
            return response;
          }),
        )
    } else {
      return throwError(() => new Error("Invalid Request Detected"));
    }
  }
}
