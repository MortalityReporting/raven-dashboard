import { TestBed } from '@angular/core/testing';

import { FhirModelTranslationService } from './fhir-model-translation.service';

describe('FhirModelTranslationService', () => {
  let service: FhirModelTranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FhirModelTranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
