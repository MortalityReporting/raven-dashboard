import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointConfigurationComponent } from './endpoint-configuration.component';

describe('EndpointConfigurationComponent', () => {
  let component: EndpointConfigurationComponent;
  let fixture: ComponentFixture<EndpointConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndpointConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
