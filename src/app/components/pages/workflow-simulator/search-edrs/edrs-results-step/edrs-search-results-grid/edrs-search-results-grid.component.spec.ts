import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdrsSearchResultsGridComponent } from './edrs-search-results-grid.component';

describe('EdrsSearchResultsComponent', () => {
  let component: EdrsSearchResultsGridComponent;
  let fixture: ComponentFixture<EdrsSearchResultsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdrsSearchResultsGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EdrsSearchResultsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
