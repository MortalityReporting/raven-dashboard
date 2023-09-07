import { TestBed } from '@angular/core/testing';

import { NgxSfmMdiService } from './ngx-sfm-mdi.service';

describe('NgxSfmMdiService', () => {
  let service: NgxSfmMdiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSfmMdiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
