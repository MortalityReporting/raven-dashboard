import { Provider } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FhirHelperService } from './services/fhir-helper.service';
import { BundleHelperService } from './services/bundle-helper.service';
import { TerminologyHandlerService } from './services/terminology-handler.service';

/**
 * Provides services for the FHIR Util module.
 * Replaces the FhirUtilModule with a modern provider function.
 */
export function provideFhirUtil(): Provider[] {
  return [
    FhirHelperService,
    BundleHelperService,
    TerminologyHandlerService,
    TitleCasePipe
  ];
}
