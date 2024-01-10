import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateComponent } from './validate.component';

describe('ValidateComponent', () => {
  let component: ValidateComponent;
  let fixture: ComponentFixture<ValidateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidateComponent]
    });
    fixture = TestBed.createComponent(ValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
