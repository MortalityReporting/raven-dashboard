import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpResponseResultsComponent } from './http-response-results.component';

describe('HttpResponseResultsComponent', () => {
  let component: HttpResponseResultsComponent;
  let fixture: ComponentFixture<HttpResponseResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HttpResponseResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HttpResponseResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
