import { TestBed } from '@angular/core/testing';

import { ToxicologyHandlerService } from './toxicology-handler.service';

describe('ToxicologyHandlerService', () => {
  let service: ToxicologyHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToxicologyHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
