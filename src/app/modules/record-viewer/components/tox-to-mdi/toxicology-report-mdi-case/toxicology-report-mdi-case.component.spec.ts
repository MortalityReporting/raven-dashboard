import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToxicologyReportMdiCaseComponent } from './toxicology-report-mdi-case.component';

describe('ToxicologyReportMdiCaseComponent', () => {
  let component: ToxicologyReportMdiCaseComponent;
  let fixture: ComponentFixture<ToxicologyReportMdiCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToxicologyReportMdiCaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToxicologyReportMdiCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
