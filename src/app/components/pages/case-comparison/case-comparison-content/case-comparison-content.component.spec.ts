import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseComparisonContentComponent } from './case-comparison-content.component';

describe('CaseSummaryContentComponent', () => {
  let component: CaseComparisonContentComponent;
  let fixture: ComponentFixture<CaseComparisonContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseComparisonContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseComparisonContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});