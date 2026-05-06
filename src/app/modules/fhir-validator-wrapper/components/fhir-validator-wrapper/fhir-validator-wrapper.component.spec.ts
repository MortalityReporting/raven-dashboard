import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FhirValidatorWrapperComponent } from './fhir-validator-wrapper.component';

describe('FhirValidatorComponent', () => {
  let component: FhirValidatorWrapperComponent;
  let fixture: ComponentFixture<FhirValidatorWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FhirValidatorWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirValidatorWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
