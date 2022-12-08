import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecedentBasicInfoComponent } from './decedent-basic-info.component';

describe('DecedentBasicInfoComponent', () => {
  let component: DecedentBasicInfoComponent;
  let fixture: ComponentFixture<DecedentBasicInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecedentBasicInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecedentBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
