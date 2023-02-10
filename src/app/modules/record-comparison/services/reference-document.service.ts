import {Injectable} from '@angular/core';
import {EnvironmentHandlerService} from "../../record-viewer/services/environment-handler.service";
import {HttpClient} from "@angular/common/http";
import {FhirHelperService} from "../../fhir-util/services/fhir-helper.service";
import {BundleHelperService} from "../../fhir-util/services/bundle-helper.service";
import {BehaviorSubject, forkJoin, map, mergeMap, Observable} from "rxjs";
import {MdiToEDRSDocumentWrapper} from "../models/mdiToEdrsDocumentWrapper";

@Injectable({
  providedIn: 'root'
})
export class ReferenceDocumentService {

  constructor(
    private environmentHandler: EnvironmentHandlerService,
    private http: HttpClient,
    private fhirHelper: FhirHelperService,
    private bundleHelper: BundleHelperService)
  {}

  getReferenceDocuments() {
    // TODO: make call to get all flagged bundles once implemented on server.
    return this.http.get(this.environmentHandler.getFhirServerBaseURL() + "Composition/").pipe(
      map((compositionSearchSetBundle: any) => (compositionSearchSetBundle.entry as Object[]))
    ).pipe(
      mergeMap( (compositionBecList: any[]) =>
          forkJoin(
            compositionBecList.map((compositionBec: any) =>{
              //console.log(compositionBec)
              return this.http.get(this.environmentHandler.getFhirServerBaseURL() + compositionBec.resource.subject.reference).pipe(
                map((subject: any) => {
                      return this.createSummary(subject, compositionBec.resource)
                  }
                )
              )
            })
          )
      )
    )
  }

  createSummary(subject: any, composition: any): any {
    return {
      "display": this.fhirHelper.getPatientOfficialName(subject),
      "compositionId": composition.id
    }
  }

  getReferenceDocumentBundle(compositionId: string) {
    return this.http.get(this.environmentHandler.getFhirServerBaseURL() + "Composition/" + compositionId + "/$document");
  }
}
