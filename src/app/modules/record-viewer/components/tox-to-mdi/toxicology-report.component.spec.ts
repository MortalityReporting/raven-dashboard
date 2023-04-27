import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToxicologyReportComponent } from './toxicology-report.component';

describe('ToxicologyReportComponent', () => {
  let component: ToxicologyReportComponent;
  let fixture: ComponentFixture<ToxicologyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToxicologyReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToxicologyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
