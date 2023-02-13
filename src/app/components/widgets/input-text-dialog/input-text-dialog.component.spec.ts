import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTextDialogComponent } from './input-text-dialog.component';

describe('InputTextDialogComponent', () => {
  let component: InputTextDialogComponent;
  let fixture: ComponentFixture<InputTextDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputTextDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTextDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
