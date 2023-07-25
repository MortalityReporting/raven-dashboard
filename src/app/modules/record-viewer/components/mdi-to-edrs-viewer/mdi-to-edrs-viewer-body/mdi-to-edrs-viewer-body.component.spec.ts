import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdiToEdrsViewerBodyComponent } from './mdi-to-edrs-viewer-body.component';

describe('MdiToEdrsViewerBodyComponent', () => {
  let component: MdiToEdrsViewerBodyComponent;
  let fixture: ComponentFixture<MdiToEdrsViewerBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdiToEdrsViewerBodyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MdiToEdrsViewerBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
