import { TestBed } from '@angular/core/testing';

import { DecedentService } from './decedent.service';

describe('DecedentService', () => {
  let service: DecedentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecedentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
