import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordComparisonContainerComponent } from './record-comparison-container.component';

describe('RecordComparisonContainerComponent', () => {
  let component: RecordComparisonContainerComponent;
  let fixture: ComponentFixture<RecordComparisonContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordComparisonContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordComparisonContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
