import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSfmMdiComponent } from './ngx-sfm-mdi.component';

describe('NgxSfmMdiComponent', () => {
  let component: NgxSfmMdiComponent;
  let fixture: ComponentFixture<NgxSfmMdiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxSfmMdiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxSfmMdiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
