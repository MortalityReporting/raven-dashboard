import { TestBed } from '@angular/core/testing';

import { FhirValidatorService } from './fhir-validator.service';

describe('FhirValidatorService', () => {
  let service: FhirValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FhirValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
