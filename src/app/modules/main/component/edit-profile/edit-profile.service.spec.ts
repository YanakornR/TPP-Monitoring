import { TestBed } from '@angular/core/testing';

import { EditProfileService } from './edit-profile.service';

describe('SiteListService', () => {
  let service: EditProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
