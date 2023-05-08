import {Inject, Injectable} from '@angular/core';
import {EnvironmentHandlerService} from "../../fhir-util/services/environment-handler.service";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import {MdiToEDRSDocumentWrapper} from "../models/mdiToEdrsDocumentWrapper";
import {FhirHelperService} from "../../fhir-util/services/fhir-helper.service";
import {BundleHelperService} from "../../fhir-util/services/bundle-helper.service";
import {Bundle} from "../../fhir-util";

@Injectable({
  providedIn: 'root'
})
export class UserDocumentService {

  constructor(
    private environmentHandler: EnvironmentHandlerService,
    private http: HttpClient,
    private fhirHelper: FhirHelperService,
    private bundleHelper: BundleHelperService
  ) { }

  getUserDocumentBundle(compositionId: string) {
    return this.http.get(this.environmentHandler.getFhirServerBaseURL() + "Composition/" + compositionId + "/$document").pipe(
      map((documentBundle: any) => {
        return this.createDocumentWrapper(documentBundle);
      })
    );
  }

  createDocumentWrapper(documentBundle: Bundle): MdiToEDRSDocumentWrapper {
    const composition = documentBundle.entry[0].resource;
    let documentWrapper = new MdiToEDRSDocumentWrapper()
    documentWrapper.decedentName = this.fhirHelper.getOfficialName(
      this.bundleHelper.findSubjectInBundle(composition, documentBundle)
    );
    documentWrapper.dateTimeOfDeath = "" // TODO: Add get dateTime of Death
    documentWrapper.mdiCaseNumber = this.fhirHelper.getTrackingNumber(composition);
    documentWrapper.mdiCaseNumberSystem = this.fhirHelper.getTrackingNumberSystem(composition)
    documentWrapper.documentBundle = documentBundle;
    return documentWrapper;
  }
}
