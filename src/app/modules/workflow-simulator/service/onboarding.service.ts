import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from "@angular/common/http";
import {BehaviorSubject, Observable, Subject, throwError} from "rxjs";
import {map} from "rxjs/operators";
import {OnboardingHttpRequest} from "../model/onboarding-http-request";
import {RequestType} from "../model/request-type";

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  private _httpReq$ = new BehaviorSubject<any>(null);
  httpReq$ = this._httpReq$.asObservable();

  private setHttpReq(httpReq: any){
    this._httpReq$.next(httpReq);
  }
  constructor(private http:HttpClient) { }


  // Example url for basic auth testing
  // https://raven.dev.heat.icl.gtri.org/mdi-fhir-server/fhir/Patient
  // https://bluejay.heat.icl.gtri.org/mdi-fhir-server/fhir/Patient
    onLogin(request: OnboardingHttpRequest): Observable<any> {


      let req: any;
      if (request.requestType == RequestType.GET) {
          req = new HttpRequest(RequestType.GET, request.url, request.httpOptions);
      }
      else if (request.requestType == RequestType.PUT) {
          req = new HttpRequest(RequestType.PUT, request.url, request.requestBody, request.httpOptions);
      }
      else if (request.requestType == RequestType.POST) {
          req = new HttpRequest(RequestType.POST, request.url, request.requestBody, request.httpOptions);
      }
      //We cann
      this.setHttpReq(JSON.parse(JSON.stringify(req)));

      return this.http.request(req);
    }
}
