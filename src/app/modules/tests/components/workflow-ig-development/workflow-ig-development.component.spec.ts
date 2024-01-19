import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowIgDevelopmentComponent } from './workflow-ig-development.component';

describe('WorkflowIgDevelopmentComponent', () => {
  let component: WorkflowIgDevelopmentComponent;
  let fixture: ComponentFixture<WorkflowIgDevelopmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowIgDevelopmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkflowIgDevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
