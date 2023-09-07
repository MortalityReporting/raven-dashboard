import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSimpleFhirModelsComponent } from './ngx-simple-fhir-models.component';

describe('NgxSimpleFhirModelsComponent', () => {
  let component: NgxSimpleFhirModelsComponent;
  let fixture: ComponentFixture<NgxSimpleFhirModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxSimpleFhirModelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxSimpleFhirModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
