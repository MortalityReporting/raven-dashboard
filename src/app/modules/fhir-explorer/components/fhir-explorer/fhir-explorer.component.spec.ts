import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FhirExplorerComponent } from './fhir-explorer.component';

describe('FhirExplorerComponent', () => {
  let component: FhirExplorerComponent;
  let fixture: ComponentFixture<FhirExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FhirExplorerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FhirExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
