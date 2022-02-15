import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from  "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DecedentService {

  constructor(private http: HttpClient) { }

  getDetails(patient: any):  Observable<any> {
    let authorizationData = 'Basic ' + btoa('client' + ':' + 'secret');

    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': authorizationData
      })
    };

    return this.http.get("https://apps.hdap.gatech.edu/raven-fhir-server/fhir/Observation?patient=" + patient.resource.id + "&code=81956-5", headerOptions).pipe( map((result: any) =>
        { console.log(result); return result?.entry[0]?.resource?.effectiveDateTime}
      )
    );
  }
  getDecedentRecords():  Observable<any> {
    const authorizationData = 'Basic ' + btoa('client' + ':' + 'secret');

    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': authorizationData
      })
    };

    return this.http.get("https://apps.hdap.gatech.edu/raven-fhir-server/fhir/Patient", headerOptions).pipe( map((result: any) => (
      result.entry as Object[]
    )));
  }

}
