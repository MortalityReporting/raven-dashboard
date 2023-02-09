import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseSummaryRelatedToxComponent } from './case-summary-related-tox.component';

describe('CaseSummaryRelatedToxComponent', () => {
  let component: CaseSummaryRelatedToxComponent;
  let fixture: ComponentFixture<CaseSummaryRelatedToxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseSummaryRelatedToxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseSummaryRelatedToxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
