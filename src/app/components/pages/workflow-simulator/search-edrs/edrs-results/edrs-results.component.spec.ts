import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdrsResultsComponent } from './edrs-results.component';

describe('EdrsResultsComponent', () => {
  let component: EdrsResultsComponent;
  let fixture: ComponentFixture<EdrsResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdrsResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EdrsResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
