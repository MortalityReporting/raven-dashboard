import { TestBed } from '@angular/core/testing';

import { BundleHelperService } from './bundle-helper.service';

describe('BundleHelperService', () => {
  let service: BundleHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BundleHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
