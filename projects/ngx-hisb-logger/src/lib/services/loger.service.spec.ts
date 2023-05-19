import { TestBed } from '@angular/core/testing';

import { LogerService } from './loger.service';

describe('LogerService', () => {
  let service: LogerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
