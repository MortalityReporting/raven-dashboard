import { TestBed } from '@angular/core/testing';

import { ReferenceDocumentService } from './reference-document.service';

describe('ReferenceDocumentService', () => {
  let service: ReferenceDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferenceDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
