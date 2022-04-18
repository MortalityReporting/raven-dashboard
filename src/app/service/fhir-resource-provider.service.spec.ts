import { TestBed } from '@angular/core/testing';

import { FhirResourceProviderService } from './fhir-resource-provider.service';

describe('FhirResourceProviderService', () => {
  let service: FhirResourceProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FhirResourceProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
