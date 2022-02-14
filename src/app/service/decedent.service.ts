import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {map} from "rxjs/operators";
import {DecedentResponse} from "../model/decedent.response";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DecedentService {

  constructor(private http: HttpClient) { }

  getCases(
    filter?: string,
    sortOrder?: string,
    sortBy?: string,
    pageNumber?: number,
    pageSize?: number):  Observable<DecedentResponse> {

    const filterParam: string = filter || '';
    const sortOrderParam: string = sortOrder || 'asc';
    const sortByParam: string = sortBy || 'personId';
    const pageNumberParam: number = pageNumber || 0;
    const pageSizePram: number = pageSize || 10;

    const headers_object = new HttpHeaders();
    headers_object.append('Content-Type', 'application/json');
    headers_object.append("Authorization", "Basic " + btoa("client:secret"));

    const httpOptions = {
      headers: headers_object
    };

    return this.http.get("https://apps.hdap.gatech.edu/raven-fhir-server/fhir/Patient", httpOptions).pipe( map((result: any) =>
        {console.log (result); return result as DecedentResponse}
      )
    );
  }


  testCall():  Observable<any> {

    let authorizationData = 'Basic ' + btoa('client' + ':' + 'secret');

    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': authorizationData
      })
    };


    return this.http.get("https://apps.hdap.gatech.edu/raven-fhir-server/fhir/Patient", headerOptions).pipe( map((result: any) =>
        {return result}
      )
    );
  }

  getDetails(patient: any):  Observable<any> {
    let authorizationData = 'Basic ' + btoa('client' + ':' + 'secret');

    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': authorizationData
      })
    };

    return this.http.get("https://apps.hdap.gatech.edu/raven-fhir-server/fhir/Observation?patient=" + patient.resource.id + "&code=81956-5", headerOptions).pipe( map((result: any) =>
        { return result?.entry[0]?.resource?.effectiveDateTime}
      )
    );
  }
}
