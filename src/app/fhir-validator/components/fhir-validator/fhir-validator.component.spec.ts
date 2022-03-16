import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FhirValidatorComponent } from './fhir-validator.component';

describe('FhirValidatorComponent', () => {
  let component: FhirValidatorComponent;
  let fixture: ComponentFixture<FhirValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FhirValidatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
