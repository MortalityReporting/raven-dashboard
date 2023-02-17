import {Injectable} from '@angular/core';
import {EnvironmentHandlerService} from "../../record-viewer/services/environment-handler.service";
import {HttpClient} from "@angular/common/http";
import {FhirHelperService} from "../../fhir-util/services/fhir-helper.service";
import {BundleHelperService} from "../../fhir-util/services/bundle-helper.service";
import {of, forkJoin, map, mergeMap, Observable} from "rxjs";
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
    return this.http.get(this.environmentHandler.getFhirServerBaseURL() + "Bundle?type=http%3A%2F%2Fconfig.raven.app%2Fcode%7Creference")
      .pipe(
        map((referenceBundleSearch: any) => (referenceBundleSearch.entry as Object[]))
      ).pipe(
        mergeMap( (bundleBecList: any[]) =>
          forkJoin(
            bundleBecList.map((bundleBec: any) =>{
              const composition = bundleBec.resource.entry[0].resource;
              console.log(composition)
              const subject = this.bundleHelper.findSubjectInBundle(composition, bundleBec.resource)
              console.log(subject)
              return of(this.createSummary(subject, bundleBec.resource));
            })
          )
        )
      )
  }

  createSummary(subject: any, bundle: any): any {
    return {
      "display": this.fhirHelper.getPatientOfficialName(subject),
      "bundle": bundle
    }
  }

  getReferenceDocumentBundle(compositionId: string) {
    return this.http.get(this.environmentHandler.getFhirServerBaseURL() + "Composition/" + compositionId + "/$document");
  }
}
