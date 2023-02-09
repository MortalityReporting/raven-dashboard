import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToxicologyGridComponent } from './toxicology-grid.component';

describe('ToxicologyGridComponent', () => {
  let component: ToxicologyGridComponent;
  let fixture: ComponentFixture<ToxicologyGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToxicologyGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToxicologyGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
