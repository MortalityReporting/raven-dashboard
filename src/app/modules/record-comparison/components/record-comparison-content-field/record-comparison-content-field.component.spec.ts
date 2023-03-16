import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordComparisonContentFieldComponent } from './record-comparison-content-field.component';

describe('RecordComparisonContentFieldComponent', () => {
  let component: RecordComparisonContentFieldComponent;
  let fixture: ComponentFixture<RecordComparisonContentFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordComparisonContentFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordComparisonContentFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
