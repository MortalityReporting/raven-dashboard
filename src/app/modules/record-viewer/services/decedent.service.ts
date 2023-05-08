import { Injectable } from '@angular/core';
import {HttpParams} from "@angular/common/http";
import {Observable, skipWhile} from "rxjs";
import {EnvironmentHandlerService} from "../../fhir-util";
import {FhirClientService} from "../../fhir-util";

@Injectable({
  providedIn: 'root'
})
export class DecedentService {

  constructor(
              private environmentHandler: EnvironmentHandlerService,
              private fhirClient: FhirClientService
  ) { }

  getDecedentObservationsByCode(decedent: any, codeList: string[]):  Observable<any> {
    // Headers are added in the FHIR Auth Interceptor
    let params = new HttpParams()
      .set('patient', decedent.id)
      .set('code', codeList.toString())

    return this.fhirClient.search("Observation", "", false, true, "", params)
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
  }

  getDocumentBundle(compositionId: string): Observable<any> {
    return this.fhirClient.read("Composition", compositionId, "/$document")
  }

  // TODO: Update demo data and move to unit testing.
  // getMockResponse(): Observable<any> {
  //   return this.http.get('../../assets/data/case_comparion_demo_data.json')
  // }
}
