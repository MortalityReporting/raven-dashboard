import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxConsoleComponent } from './ngx-console.component';

describe('ConsoleComponent', () => {
  let component: NgxConsoleComponent;
  let fixture: ComponentFixture<NgxConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxConsoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
