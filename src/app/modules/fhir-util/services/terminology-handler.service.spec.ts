import { TestBed } from '@angular/core/testing';

import { TerminologyHandlerService } from './terminology-handler.service';

describe('TerminologyHandlerService', () => {
  let service: TerminologyHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerminologyHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
