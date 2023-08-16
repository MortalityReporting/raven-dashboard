import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdiToEdrsDocumentSelectStepComponent } from './mdi-to-edrs-document-select-step.component';

describe('SelectMdiToEdrsDocumentStepComponent', () => {
  let component: MdiToEdrsDocumentSelectStepComponent;
  let fixture: ComponentFixture<MdiToEdrsDocumentSelectStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdiToEdrsDocumentSelectStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdiToEdrsDocumentSelectStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
