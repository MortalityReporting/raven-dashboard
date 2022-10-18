import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConformationDialogComponent } from './conformation-dialog.component';

describe('ConformationDialogComponent', () => {
  let component: ConformationDialogComponent;
  let fixture: ComponentFixture<ConformationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConformationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
