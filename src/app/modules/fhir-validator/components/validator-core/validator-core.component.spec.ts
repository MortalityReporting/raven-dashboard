import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorCoreComponent } from './validator-core.component';

describe('FhirValidatorComponent', () => {
  let component: ValidatorCoreComponent;
  let fixture: ComponentFixture<ValidatorCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidatorCoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
