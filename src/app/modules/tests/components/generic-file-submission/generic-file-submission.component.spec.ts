import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericFileSubmissionComponent } from './generic-file-submission.component';

describe('GenericFileSubmissionComponent', () => {
  let component: GenericFileSubmissionComponent;
  let fixture: ComponentFixture<GenericFileSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericFileSubmissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenericFileSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
