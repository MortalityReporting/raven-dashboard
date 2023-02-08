import { TestBed } from '@angular/core/testing';

import { FhirExplorerDrawerService } from './fhir-explorer-drawer.service';

describe('FhirExplorerDrawerService', () => {
  let service: FhirExplorerDrawerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FhirExplorerDrawerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
