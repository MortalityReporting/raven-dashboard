import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseContainerComponent } from './case-container.component';

describe('CaseContainerComponent', () => {
  let component: CaseContainerComponent;
  let fixture: ComponentFixture<CaseContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
