import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FhirValidatorJsComponent } from './fhir-validator-js.component';

describe('FhirValidatorJsComponent', () => {
  let component: FhirValidatorJsComponent;
  let fixture: ComponentFixture<FhirValidatorJsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FhirValidatorJsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirValidatorJsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
