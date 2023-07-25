import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdiToEdrsViewerNavMenuComponent } from './mdi-to-edrs-viewer-nav-menu.component';

describe('MdiToEdrsViewerNavMenuComponent', () => {
  let component: MdiToEdrsViewerNavMenuComponent;
  let fixture: ComponentFixture<MdiToEdrsViewerNavMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdiToEdrsViewerNavMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MdiToEdrsViewerNavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
