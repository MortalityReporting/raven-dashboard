import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdrsResultsStepComponent } from './edrs-results-step.component';

describe('EdrsResultsComponent', () => {
  let component: EdrsResultsStepComponent;
  let fixture: ComponentFixture<EdrsResultsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdrsResultsStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EdrsResultsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
