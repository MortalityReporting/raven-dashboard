import { TestBed } from '@angular/core/testing';

import { FhirAuthInterceptor } from './fhir-auth.interceptor';

describe('FhirAuthInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      FhirAuthInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: FhirAuthInterceptor = TestBed.inject(FhirAuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
