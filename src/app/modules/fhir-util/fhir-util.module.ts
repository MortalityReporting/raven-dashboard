import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FhirHelperService } from "./services/fhir-helper.service";
import { ProfileProviderService } from "./services/profile-provider.service";
import { BundleHelperService } from "./services/bundle-helper.service";
import { TerminologyHandlerService } from "./services/terminology-handler.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
  ],
  providers: [
    FhirHelperService,
    ProfileProviderService,
    BundleHelperService,
    TerminologyHandlerService
  ]
})
export class FhirUtilModule {}
