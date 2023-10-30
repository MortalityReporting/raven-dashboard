import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorFrameComponent } from './error-frame.component';

describe('ErrorFrameComponent', () => {
  let component: ErrorFrameComponent;
  let fixture: ComponentFixture<ErrorFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
