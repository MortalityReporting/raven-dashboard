import { TestBed } from '@angular/core/testing';

import { DocumentHandlerService } from './document-handler.service';

describe('DocumentHandlerService', () => {
  let service: DocumentHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
