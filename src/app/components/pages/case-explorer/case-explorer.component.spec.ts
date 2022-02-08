import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseExplorerComponent } from './case-explorer.component';

describe('CaseExplorerComponent', () => {
  let component: CaseExplorerComponent;
  let fixture: ComponentFixture<CaseExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseExplorerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
