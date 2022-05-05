import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseSummaryContentFieldComponent } from './case-summary-content-field.component';

describe('CaseSummaryContentFieldComponent', () => {
  let component: CaseSummaryContentFieldComponent;
  let fixture: ComponentFixture<CaseSummaryContentFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseSummaryContentFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseSummaryContentFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
