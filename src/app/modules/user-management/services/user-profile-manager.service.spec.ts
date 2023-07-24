import { TestBed } from '@angular/core/testing';

import { UserProfileManagerService } from './user-profile-manager.service';

describe('UserProfileManagerService', () => {
  let service: UserProfileManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserProfileManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
