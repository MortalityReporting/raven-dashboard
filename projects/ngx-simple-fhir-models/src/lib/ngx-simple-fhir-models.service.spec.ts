import { TestBed } from '@angular/core/testing';

import { NgxSimpleFhirModelsService } from './ngx-simple-fhir-models.service';

describe('NgxSimpleFhirModelsService', () => {
  let service: NgxSimpleFhirModelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSimpleFhirModelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
