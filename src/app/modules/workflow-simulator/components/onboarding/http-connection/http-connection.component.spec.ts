import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpConnectionComponent } from './http-connection.component';

describe('OnboardingComponent', () => {
  let component: HttpConnectionComponent;
  let fixture: ComponentFixture<HttpConnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HttpConnectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HttpConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
