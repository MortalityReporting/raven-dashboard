import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableModuleViewComponent } from './available-module-view.component';

describe('AvailableModuleViewComponent', () => {
  let component: AvailableModuleViewComponent;
  let fixture: ComponentFixture<AvailableModuleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableModuleViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableModuleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
