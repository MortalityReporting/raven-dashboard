import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCaseConnectathonTemplateComponent } from './import-case-connectathon-template.component';

describe('ImportCaseConnectathonTemplateComponent', () => {
  let component: ImportCaseConnectathonTemplateComponent;
  let fixture: ComponentFixture<ImportCaseConnectathonTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportCaseConnectathonTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCaseConnectathonTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
