import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEdrsComponent } from './update-edrs.component';

describe('UpdateEdrsComponent', () => {
  let component: UpdateEdrsComponent;
  let fixture: ComponentFixture<UpdateEdrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateEdrsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateEdrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
