import { TestBed } from '@angular/core/testing';

import { RegisteredEndpointsInterceptor } from './registered-endpoints.interceptor';

describe('RegisteredEndpointsInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      RegisteredEndpointsInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: RegisteredEndpointsInterceptor = TestBed.inject(RegisteredEndpointsInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
