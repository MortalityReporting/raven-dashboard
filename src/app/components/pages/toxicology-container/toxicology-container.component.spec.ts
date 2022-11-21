import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToxicologyContainerComponent } from './toxicology-container.component';

describe('ToxicologyContainerComponent', () => {
  let component: ToxicologyContainerComponent;
  let fixture: ComponentFixture<ToxicologyContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToxicologyContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToxicologyContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
