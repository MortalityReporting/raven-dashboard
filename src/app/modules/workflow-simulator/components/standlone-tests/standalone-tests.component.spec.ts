import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandaloneTestsComponent } from './standalone-tests.component';

describe('AvailableModuleViewComponent', () => {
  let component: StandaloneTestsComponent;
  let fixture: ComponentFixture<StandaloneTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandaloneTestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandaloneTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
