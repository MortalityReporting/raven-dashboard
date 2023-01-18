import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdrsRecordSummaryComponent } from './edrs-record-summary.component';

describe('EdrsRecordSummaryComponent', () => {
  let component: EdrsRecordSummaryComponent;
  let fixture: ComponentFixture<EdrsRecordSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdrsRecordSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EdrsRecordSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
