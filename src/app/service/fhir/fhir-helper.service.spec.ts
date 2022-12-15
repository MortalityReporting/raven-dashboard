import { TestBed } from '@angular/core/testing';

import { FhirHelperService } from './fhir-helper.service';

describe('FhirHelperService', () => {
  let service: FhirHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FhirHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
