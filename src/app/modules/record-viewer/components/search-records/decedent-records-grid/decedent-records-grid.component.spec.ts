import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecedentRecordsGridComponent } from './decedent-records-grid.component';

describe('CaseExplorerComponent', () => {
  let component: DecedentRecordsGridComponent;
  let fixture: ComponentFixture<DecedentRecordsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecedentRecordsGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecedentRecordsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
