import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecedentDisplayComponent } from './decedent-display.component';

describe('DecedentDisplayComponent', () => {
  let component: DecedentDisplayComponent;
  let fixture: ComponentFixture<DecedentDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecedentDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecedentDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
