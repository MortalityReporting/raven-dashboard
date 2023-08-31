import { TestBed } from '@angular/core/testing';

import { DashboardApiInterfaceService } from './dashboard-api-interface.service';

describe('DashboardApiInterfaceService', () => {
  let service: DashboardApiInterfaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardApiInterfaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
