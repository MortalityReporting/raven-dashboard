import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FhirHelperService } from "./services/fhir-helper.service";
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
    BundleHelperService,
    TerminologyHandlerService
  ]
})
export class FhirUtilModule {}
