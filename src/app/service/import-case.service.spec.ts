import { TestBed } from '@angular/core/testing';

import { ImportCaseService } from './import-case.service';

describe('ImportCaseService', () => {
  let service: ImportCaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportCaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
