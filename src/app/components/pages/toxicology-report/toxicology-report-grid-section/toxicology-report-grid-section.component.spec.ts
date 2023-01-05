import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToxicologyReportGridSectionComponent } from './toxicology-report-grid-section.component';

describe('ToxicologyReportGridSectionComponent', () => {
  let component: ToxicologyReportGridSectionComponent;
  let fixture: ComponentFixture<ToxicologyReportGridSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToxicologyReportGridSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToxicologyReportGridSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
