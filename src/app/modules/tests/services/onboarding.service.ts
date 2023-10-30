import {Injectable} from '@angular/core';
import {OnboardingHttpRequest} from "../models/onboarding-http-request";
import {HttpClient, HttpRequest} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {RequestType} from "../models/request-type";

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
      // We cannot get the properties out of the request object unless we convert it to string and back to object
      // (in effect we are forcing an object copy)
      this.setHttpReq(JSON.parse(JSON.stringify(req)));

      return this.http.request(req);
    }
}
