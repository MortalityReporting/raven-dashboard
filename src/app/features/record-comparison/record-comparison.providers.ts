import { Provider } from '@angular/core';
import { ReferenceDocumentService } from './services/reference-document.service';
import { ModuleHeaderConfig } from '../../providers/module-header-config';

/**
 * Provides configuration and services for the Record Comparison module.
 * Replaces the RecordComparisonModule.forRoot() pattern with a modern provider function.
 */
export function provideRecordComparison(config: ModuleHeaderConfig, fhirProfiles: any): Provider[] {
  return [
    ReferenceDocumentService,
    {
      provide: 'comparisonConfig',
      useValue: config
    },
    {
      provide: 'fhirProfiles',
      useValue: fhirProfiles
    }
  ];
}
