import { TestBed } from '@angular/core/testing';

import { ComparisonParserService } from './comparison-parser.service';

describe('ComparisonParserService', () => {
  let service: ComparisonParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComparisonParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
