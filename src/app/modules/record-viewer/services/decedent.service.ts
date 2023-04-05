import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, skipWhile} from "rxjs";
import {map} from  "rxjs/operators";
import {EnvironmentHandlerService} from "../../fhir-util/services/environment-handler.service";
import {FhirClientService} from "../../fhir-util/services/fhir-client.service";

@Injectable({
  providedIn: 'root'
})
export class DecedentService {

  constructor(private http: HttpClient,
              private environmentHandler: EnvironmentHandlerService,
              private fhirClient: FhirClientService
  ) { }

  getDecedentObservationsByCode(decedent: any, codeList: string[]):  Observable<any> {
    // Headers are added in the FHIR Auth Interceptor
    let params = new HttpParams()
      .set('patient', decedent.id)
      .set('code', codeList.toString())

    // return this.http.get(this.getFhirServerBaseURL() + "Observation?patient=" + decedent.resource.id + "&code=81956-5")
    return this.http.get(this.environmentHandler.getFhirServerBaseURL() + "Observation" , {params: params})
      .pipe( map((result: any) => result));
  }
Z
  getDecedentRecords():  Observable<any> {
    // Headers are added in the FHIR Auth Interceptor
    return this.fhirClient.search("Patient", "", true).pipe(
      skipWhile((result: any) => {
        return !result
      })
    );
  }

  getComposition(subjectId: string): Observable<any> {
    return this.fhirClient.search(`Composition`,`?subject=${subjectId}`)
    //return this.http.get(this.environmentHandler.getFhirServerBaseURL() + "Composition?subject=" + subjectId);
  }

  getDocumentBundle(compositionId: string): Observable<any> {
    return this.http.get(this.environmentHandler.getFhirServerBaseURL() + "Composition/" + compositionId + "/$document");
  }

  getMockResponse(): Observable<any> {
    return this.http.get('../../assets/data/case_comparion_demo_data.json')
  }
}
