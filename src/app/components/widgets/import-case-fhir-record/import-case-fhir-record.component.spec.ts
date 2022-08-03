import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCaseFhirRecordComponent } from './import-case-fhir-record.component';

describe('ImportCaseFhirRecordComponent', () => {
  let component: ImportCaseFhirRecordComponent;
  let fixture: ComponentFixture<ImportCaseFhirRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportCaseFhirRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCaseFhirRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
