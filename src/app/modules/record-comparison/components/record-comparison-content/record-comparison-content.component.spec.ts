import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordComparisonContentComponent } from './record-comparison-content.component';

describe('RecordComparisonContentComponent', () => {
  let component: RecordComparisonContentComponent;
  let fixture: ComponentFixture<RecordComparisonContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordComparisonContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordComparisonContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
