import { TestBed } from '@angular/core/testing';

import { ProfileProviderService } from './profile-provider.service';

describe('ProfileProviderService', () => {
  let service: ProfileProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
