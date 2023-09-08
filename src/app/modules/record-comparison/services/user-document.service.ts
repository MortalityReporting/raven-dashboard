import {Inject, Injectable} from '@angular/core';
import {FhirHelperService, BundleHelperService} from "../../fhir-util";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import {MdiToEDRSDocumentWrapper} from "../models/mdiToEdrsDocumentWrapper";
import {Bundle} from "../../fhir-util";
import {ConfigService} from "../../../service/config.service";
import {Config} from "../../../model/config";

@Injectable({
  providedIn: 'root'
})
export class UserDocumentService {

  config: Config;

  constructor(
    private http: HttpClient,
    private fhirHelper: FhirHelperService,
    private bundleHelper: BundleHelperService,
    private configService: ConfigService
  ) {
    this.config = this.configService.config;
  }

  getUserDocumentBundle(compositionId: string) {
    return this.http.get(this.config.ravenFhirServerBaseUrl + "Composition/" + compositionId + "/$document").pipe(
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
