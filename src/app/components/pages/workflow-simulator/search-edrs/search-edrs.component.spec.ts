import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEdrsComponent } from './search-edrs.component';

describe('SearchEdrsComponent', () => {
  let component: SearchEdrsComponent;
  let fixture: ComponentFixture<SearchEdrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchEdrsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEdrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
