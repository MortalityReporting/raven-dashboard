import { ComponentFixture, TestBed } from '@angular/core/testing';

import {SearchRecordsComponent} from "./search-records.component";

describe('LandingComponent', () => {
  let component: SearchRecordsComponent;
  let fixture: ComponentFixture<SearchRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
