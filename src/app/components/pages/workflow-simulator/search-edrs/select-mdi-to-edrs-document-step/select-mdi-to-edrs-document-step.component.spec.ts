import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMdiToEdrsDocumentStepComponent } from './select-mdi-to-edrs-document-step.component';

describe('SelectMdiToEdrsDocumentStepComponent', () => {
  let component: SelectMdiToEdrsDocumentStepComponent;
  let fixture: ComponentFixture<SelectMdiToEdrsDocumentStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectMdiToEdrsDocumentStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMdiToEdrsDocumentStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
