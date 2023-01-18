import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpRequestInfoComponent } from './http-request-info.component';

describe('HttpRequestInfoComponent', () => {
  let component: HttpRequestInfoComponent;
  let fixture: ComponentFixture<HttpRequestInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HttpRequestInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpRequestInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
