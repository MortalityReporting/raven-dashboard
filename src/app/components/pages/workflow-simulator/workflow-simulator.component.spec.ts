import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowSimulatorComponent } from './workflow-simulator.component';

describe('WorkflowSimulatorComponent', () => {
  let component: WorkflowSimulatorComponent;
  let fixture: ComponentFixture<WorkflowSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowSimulatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
