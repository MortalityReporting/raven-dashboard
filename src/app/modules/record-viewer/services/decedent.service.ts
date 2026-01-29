import { Injectable } from '@angular/core';
import {HttpParams} from "@angular/common/http";
import {Observable, skipWhile, tap} from "rxjs";
import {FhirClientService, FhirResource} from "../../fhir-util";
// import {SortDirection} from "@angular/material/sort-direction.d";

@Injectable({
  providedIn: 'root'
})
export class DecedentService {

  constructor(private fhirClient: FhirClientService) { }

  getDecedentObservationsByCode(decedent: any, codeList: string[]):  Observable<any> {
    // Headers are added in the FHIR Auth Interceptor
    let params = new HttpParams()
      .set('patient', decedent.id)
      .set('code', codeList.toString())

    return this.fhirClient.search("Observation", "", false, true, "", params)
  }

  getDecedentRecords(pageNumber: number, pageSize: number = 10):  Observable<any> {
    const getPagesOffset = pageNumber * pageSize;
    return this.fhirClient.search("Patient", `?_count=${pageSize}&_getpagesoffset=${getPagesOffset}`, false, true ).pipe(
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


// totalItems: number = 810; // Total records from your API
// pageSize: number = 20;   // Items per page
//
// // Function to calculate the offset for the last page
// getLastPageOffset(): number {
//   const totalPages = Math.ceil(this.totalItems / this.pageSize);
//   // Ensure we don't calculate an offset for page 0 if there are no items
//   if (totalPages === 0) {
//     return 0;
//   }
//   const lastPageOffset = (totalPages - 1) * this.pageSize;
//   return lastPageOffset;
// }
