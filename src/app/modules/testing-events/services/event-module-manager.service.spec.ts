import { TestBed } from '@angular/core/testing';

import { EventModuleManagerService } from './event-module-manager.service';

describe('EventModuleManagerService', () => {
  let service: EventModuleManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventModuleManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
