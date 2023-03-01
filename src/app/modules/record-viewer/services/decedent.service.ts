import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from  "rxjs/operators";
import {environment} from "../../../../environments/environment";
import {EnvironmentHandlerService} from "./environment-handler.service";

@Injectable({
  providedIn: 'root'
})
export class DecedentService {

  constructor(private http: HttpClient, private environmentHandler: EnvironmentHandlerService) { }

  getDecedentObservationsByCode(decedent: any, codeList: string[]):  Observable<any> {
    // Headers are added in the FHIR Auth Interceptor
    let params = new HttpParams()
      .set('patient', decedent.resource.id)
      .set('code', codeList.toString())

    // return this.http.get(this.getFhirServerBaseURL() + "Observation?patient=" + decedent.resource.id + "&code=81956-5")
    return this.http.get(this.environmentHandler.getFhirServerBaseURL() + "Observation" , {params: params})
      .pipe( map((result: any) => result));
  }

  getDecedentRecords():  Observable<any> {
    return this.http.get(this.environmentHandler.getFhirServerBaseURL() + "Patient?_count=100")
      .pipe( map((result: any) => {
        // By convention the API should return an empty array. However, the FHIR server we use does not.
        // We are adding an empty array to prevent NPE errors in the components using this service.
          if (!result?.entry) {
            return [];
          }
          else {
            return result.entry as Object[];
          }
        }
      ));
  }

  getComposition(subjectId: string): Observable<any> {
    return this.http.get(this.environmentHandler.getFhirServerBaseURL() + "Composition?subject=" + subjectId);
  }

  getDocumentBundle(compositionId: string): Observable<any> {
    return this.http.get(this.environmentHandler.getFhirServerBaseURL() + "Composition/" + compositionId + "/$document");
  }

  getMockResponse(): Observable<any> {
    return this.http.get('../../assets/data/case_comparion_demo_data.json')
  }
}
