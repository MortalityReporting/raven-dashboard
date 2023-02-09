import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCaseComponent } from './import-case.component';

describe('ImportCaseComponent', () => {
  let component: ImportCaseComponent;
  let fixture: ComponentFixture<ImportCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportCaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
