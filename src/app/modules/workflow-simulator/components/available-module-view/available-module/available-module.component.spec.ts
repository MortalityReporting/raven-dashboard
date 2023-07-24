import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableModuleComponent } from './available-module.component';

describe('AvailableModuleComponent', () => {
  let component: AvailableModuleComponent;
  let fixture: ComponentFixture<AvailableModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
