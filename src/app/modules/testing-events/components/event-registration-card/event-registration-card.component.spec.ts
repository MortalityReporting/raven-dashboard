import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRegistrationCardComponent } from './event-registration-card.component';

describe('EventRegistrationCardComponent', () => {
  let component: EventRegistrationCardComponent;
  let fixture: ComponentFixture<EventRegistrationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventRegistrationCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventRegistrationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
