import {Injectable} from '@angular/core';
import {of, forkJoin, map, mergeMap} from "rxjs";
import {BundleHelperService, FhirHelperService} from "../../fhir-util";
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../../../service/config.service";
import {Config} from "../../../model/config";

@Injectable({
  providedIn: 'root'
})
export class ReferenceDocumentService {

  config: Config;

  constructor(
    private http: HttpClient,
    private fhirHelper: FhirHelperService,
    private bundleHelper: BundleHelperService,
    private configService: ConfigService
  ) {
    this.config = this.configService.config;
  }


  getReferenceDocuments() {
    return this.http.get(this.config.ravenFhirServerBaseUrl + "Bundle?type=http%3A%2F%2Fconfig.raven.app%2Fcode%7Creference")
      .pipe(
        map((referenceBundleSearch: any) =>{
          // By convention the API should return an empty array. However, the FHIR server we use does not.
          // We are adding an empty array to prevent NPE errors in the components using this services.
          if (!referenceBundleSearch?.entry) {
            return [];
          }
          else {
            return referenceBundleSearch.entry as Object[];
          }
        })
      ).pipe(
        mergeMap( (bundleBecList: any[]) =>
          forkJoin(
            bundleBecList.map((bundleBec: any) =>{
              const composition = bundleBec.resource.entry[0].resource;
              const subject = this.bundleHelper.findSubjectInBundle(composition, bundleBec.resource)
              return of(this.createSummary(subject, bundleBec.resource));
            })
          )
        )
      )
  }

  createSummary(subject: any, bundle: any): any {
    return {
      "display": this.fhirHelper.getOfficialName(subject),
      "bundle": bundle
    }
  }

  getReferenceDocumentBundle(compositionId: string) {
    return this.http.get(this.config.ravenFhirServerBaseUrl + "Composition/" + compositionId + "/$document");
  }
}
