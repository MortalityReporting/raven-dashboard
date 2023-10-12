import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {DecedentSimpleInfo} from "../../../model/decedent-simple-info";
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConfigService} from "../../../service/config.service";
import {Config} from "../../../model/config";

@Injectable({
  providedIn: 'root'
})
export class SearchEdrsService {

  private documentBundle = new Subject<any>();
  documentBundle$ = this.documentBundle.asObservable();

  private testStatus = new Subject<any>();
  testStatus$ = this.testStatus.asObservable();

  private edrsHttpRequestInfo = new Subject<any>();
  edrsHttpRequestInfo$ = this.edrsHttpRequestInfo.asObservable();

  private decedentData = new Subject<DecedentSimpleInfo>();
  decedentData$ = this.decedentData.asObservable();

  private endpoint = new Subject<any>();
  endpoint$ = this.endpoint.asObservable();

  config: Config;

  constructor(
    private http:HttpClient,
    private configService: ConfigService
  ) {
    this.config = this.configService.config;
  }

  setDocumentBundle(data): void {
    this.documentBundle.next(data);
  }

  setEdrsHttpRequestInfo(data): void {
    this.edrsHttpRequestInfo.next(data);
  }

  setTestStatus(status): void {
    this.testStatus.next(status);
  }

  setEndpoint(endpoint: string, basic: {username: string, password: string}) {
    if (!endpoint) this.endpoint.next(undefined);
    else {
      this.endpoint.next({
        endpoint: endpoint,
        auth: basic
      }
      )
    }
  }

  setDecedentData(data: DecedentSimpleInfo): void {
    this.decedentData.next(data);
  }

  getOperationDefinitionList(): Observable<any> {
    const operationDefinitionLocation = "OperationDefinition/Composition-it-document";
    return this.http.get(this.config.ravenFhirServerBaseUrl + operationDefinitionLocation).pipe(map((result: any) => (
      result as Object
    )));
  }


  searchEdrs(uri, params, auth?): Observable<any> {

    let authorizationData: string = 'Basic ' + btoa(auth);
    if (auth) {
      const basicAuthString = `${auth.username}:${auth.password}`;
      authorizationData = 'Basic ' + btoa(basicAuthString);
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': authorizationData
      })
    };

    const operationDefinitionLocation = uri+ "/Composition/$mdi-documents";

    this.setEdrsHttpRequestInfo({
      url : operationDefinitionLocation
    });

    return this.http.post(operationDefinitionLocation, params, httpOptions).pipe(map(result => {
        this.setTestStatus("completed");
        return result;
      }
    ));
  }

}
