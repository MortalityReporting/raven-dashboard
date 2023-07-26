import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdiToEdrsViewerContentComponent } from './mdi-to-edrs-viewer-content.component';

describe('MdiToEdrsViewerContentComponent', () => {
  let component: MdiToEdrsViewerContentComponent;
  let fixture: ComponentFixture<MdiToEdrsViewerContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdiToEdrsViewerContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MdiToEdrsViewerContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
