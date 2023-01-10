import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdiToEdrsGridComponent } from './mdi-to-edrs-grid.component';

describe('MdiToEdrsGridComponent', () => {
  let component: MdiToEdrsGridComponent;
  let fixture: ComponentFixture<MdiToEdrsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdiToEdrsGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdiToEdrsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
