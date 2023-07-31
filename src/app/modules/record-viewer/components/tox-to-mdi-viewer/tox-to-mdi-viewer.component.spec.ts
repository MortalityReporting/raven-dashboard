import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToxToMdiViewerComponent } from './tox-to-mdi-viewer.component';

describe('ToxToMdiViewerComponent', () => {
  let component: ToxToMdiViewerComponent;
  let fixture: ComponentFixture<ToxToMdiViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToxToMdiViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToxToMdiViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
