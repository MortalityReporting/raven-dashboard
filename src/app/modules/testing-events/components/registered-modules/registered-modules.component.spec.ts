import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredModulesComponent } from './registered-modules.component';

describe('RegisteredModulesComponent', () => {
  let component: RegisteredModulesComponent;
  let fixture: ComponentFixture<RegisteredModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisteredModulesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisteredModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
