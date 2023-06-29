import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FhirHelperService } from "./services/fhir-helper.service";
import { BundleHelperService } from "./services/bundle-helper.service";
import { TerminologyHandlerService } from "./services/terminology-handler.service";
import {DocRefBase64TransformPipe} from "./pipes/doc-ref-base64-transform.pipe";

@NgModule({
  declarations: [
    DocRefBase64TransformPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DocRefBase64TransformPipe
  ],
  providers: [
    FhirHelperService,
    BundleHelperService,
    TerminologyHandlerService
  ]
})
export class FhirUtilModule {}
