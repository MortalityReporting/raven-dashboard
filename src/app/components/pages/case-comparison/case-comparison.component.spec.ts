import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseComparisonComponent } from './case-comparison.component';

describe('CaseSummaryComponent', () => {
  let component: CaseComparisonComponent;
  let fixture: ComponentFixture<CaseComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseComparisonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
