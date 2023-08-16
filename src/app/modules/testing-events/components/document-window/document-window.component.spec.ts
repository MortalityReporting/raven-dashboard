import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentWindowComponent } from './document-window.component';

describe('DocumentWindowComponent', () => {
  let component: DocumentWindowComponent;
  let fixture: ComponentFixture<DocumentWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentWindowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
