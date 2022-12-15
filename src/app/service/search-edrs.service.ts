import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {DecedentSimpleInfo} from "../model/decedent-simple-info";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

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


  searchEdrs(params): Observable<any> {
    const operationDefinitionLocation = "Composition/$mdi-documents";
    return this.http.post(environment.ravenFhirServer  + operationDefinitionLocation, params).pipe(map((result: any) => (
      result as Object
    )));
  }

}
