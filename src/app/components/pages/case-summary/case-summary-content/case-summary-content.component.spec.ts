import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseSummaryContentComponent } from './case-summary-content.component';

describe('CaseSummaryContentComponent', () => {
  let component: CaseSummaryContentComponent;
  let fixture: ComponentFixture<CaseSummaryContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseSummaryContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseSummaryContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
