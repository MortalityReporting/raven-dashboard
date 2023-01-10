import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdrsSearchResultsComponent } from './edrs-search-results.component';

describe('EdrsSearchResultsComponent', () => {
  let component: EdrsSearchResultsComponent;
  let fixture: ComponentFixture<EdrsSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdrsSearchResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EdrsSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
