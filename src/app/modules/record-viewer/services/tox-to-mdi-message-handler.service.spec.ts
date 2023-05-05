import { TestBed } from '@angular/core/testing';
import {ToxToMdiMessageHandlerService} from "./tox-to-mdi-message-handler.service";


describe('ToxToMdiMessageHandlerService', () => {
  let service: ToxToMdiMessageHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToxToMdiMessageHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
