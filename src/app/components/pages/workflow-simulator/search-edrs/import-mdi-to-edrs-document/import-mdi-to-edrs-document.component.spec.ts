import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportMdiToEdrsDocumentComponent } from './import-mdi-to-edrs-document.component';

describe('ImportMdiToEdrsDocumentComponent', () => {
  let component: ImportMdiToEdrsDocumentComponent;
  let fixture: ComponentFixture<ImportMdiToEdrsDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportMdiToEdrsDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportMdiToEdrsDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
