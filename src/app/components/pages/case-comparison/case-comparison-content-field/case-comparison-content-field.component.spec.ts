import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseComparisonContentFieldComponent } from './case-comparison-content-field.component';

describe('CaseComparisonContentFieldComponent', () => {
  let component: CaseComparisonContentFieldComponent;
  let fixture: ComponentFixture<CaseComparisonContentFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseComparisonContentFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseComparisonContentFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
