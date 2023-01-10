import { TestBed } from '@angular/core/testing';

import { SearchEdrsService } from './search-edrs.service';

describe('SearchEdrsService', () => {
  let service: SearchEdrsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchEdrsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
