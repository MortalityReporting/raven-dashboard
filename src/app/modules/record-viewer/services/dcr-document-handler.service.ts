import { Injectable } from '@angular/core';
import {Observable, tap} from "rxjs";
import {Bundle, BundleHelperService, FhirClientService, FhirHelperService, FhirResource} from "../../fhir-util";
import {map} from "rxjs/operators";
import {ToxToMdiRecord} from "../models/toxToMdiRecord";

@Injectable({
  providedIn: 'root'
})
export class DcrDocumentHandlerService {

  constructor(
    private fhirClient: FhirClientService,
    private fhirHelper: FhirHelperService,
    private bundleHelper: BundleHelperService
  ) { }

  getRecord(recordId: string): Observable<any> {
    return this.fhirClient.search("Bundle/MDI-DEV-GOLDENSET-DCR-1-DCR-Document-Message-Bundle").pipe(
      tap((record) => {
        console.log(record);
      })
    )
  }

}
