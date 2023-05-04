import { TestBed } from '@angular/core/testing';

import { MdiToEdrsDocumentHandlerService } from './mdi-to-edrs-document-handler.service';

describe('MdiToEdrsDocumentHandlerService', () => {
  let service: MdiToEdrsDocumentHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MdiToEdrsDocumentHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
