import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToxicologyReportContentComponent } from './toxicology-report-content.component';

describe('ToxicologyReportContentComponent', () => {
  let component: ToxicologyReportContentComponent;
  let fixture: ComponentFixture<ToxicologyReportContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToxicologyReportContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToxicologyReportContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
