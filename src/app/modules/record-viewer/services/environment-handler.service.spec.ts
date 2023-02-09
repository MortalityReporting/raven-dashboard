import { TestBed } from '@angular/core/testing';

import { EnvironmentHandlerService } from './environment-handler.service';

describe('EnvironmentHandlerService', () => {
  let service: EnvironmentHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvironmentHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
