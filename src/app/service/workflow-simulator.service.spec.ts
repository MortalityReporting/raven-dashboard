import { TestBed } from '@angular/core/testing';

import { WorkflowSimulatorService } from './workflow-simulator.service';

describe('WorkflowSimulatorService', () => {
  let service: WorkflowSimulatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkflowSimulatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
