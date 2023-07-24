import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectathonModuleViewComponent } from './connectathon-module-view.component';

describe('ConnectathonModuleViewComponent', () => {
  let component: ConnectathonModuleViewComponent;
  let fixture: ComponentFixture<ConnectathonModuleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectathonModuleViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectathonModuleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
