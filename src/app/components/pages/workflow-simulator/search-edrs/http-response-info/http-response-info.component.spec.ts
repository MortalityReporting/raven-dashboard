import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpResponseInfoComponent } from './http-response-info.component';

describe('HttpResponseInfoComponent', () => {
  let component: HttpResponseInfoComponent;
  let fixture: ComponentFixture<HttpResponseInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HttpResponseInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpResponseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
