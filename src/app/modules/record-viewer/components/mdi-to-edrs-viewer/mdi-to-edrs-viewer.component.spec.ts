import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdiToEdrsViewerComponent } from './mdi-to-edrs-viewer.component';

describe('MdiToEdrsViewerComponent', () => {
  let component: MdiToEdrsViewerComponent;
  let fixture: ComponentFixture<MdiToEdrsViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdiToEdrsViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MdiToEdrsViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
