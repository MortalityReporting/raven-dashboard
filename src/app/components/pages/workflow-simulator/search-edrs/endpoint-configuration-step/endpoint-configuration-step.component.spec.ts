import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointConfigurationStepComponent } from './endpoint-configuration-step.component';

describe('EndpointConfigurationComponent', () => {
  let component: EndpointConfigurationStepComponent;
  let fixture: ComponentFixture<EndpointConfigurationStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndpointConfigurationStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointConfigurationStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
