import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {DecedentSimpleInfo} from "../model/decedent-simple-info";
import {blueJay, environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SearchEdrsService {

  private documentBundle = new Subject<any>();
  documentBundle$ = this.documentBundle.asObservable();

  private decedentData = new Subject<DecedentSimpleInfo>();
  decedentData$ = this.decedentData.asObservable();

  constructor(private http:HttpClient) { }

  setDocumentBundle(data): void {
    this.documentBundle.next(data);
  }

  setDecedentData(data: DecedentSimpleInfo): void {
    this.decedentData.next(data);
  }

  getOperationDefinitionList(): Observable<any> {
    const operationDefinitionLocation = "OperationDefinition/Composition-it-mdi-documents";
    return this.http.get(environment.ravenFhirServer + operationDefinitionLocation).pipe(map((result: any) => (
      result as Object
    )));
  }


  searchEdrs(uri, params): Observable<any> {

    const authorizationData = 'Basic ' + btoa(blueJay.serverBasicAuth);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': authorizationData
      })
    };

    const operationDefinitionLocation = uri+ "/Composition/$mdi-documents";
    return this.http.post(operationDefinitionLocation, params, httpOptions).pipe(map((result: any) => (
      result as Object
    )));
  }

}
