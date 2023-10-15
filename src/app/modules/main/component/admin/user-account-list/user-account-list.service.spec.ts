import { TestBed } from '@angular/core/testing';

import { UserAccountListService } from './user-account-list.service';

describe('UserAccountListService', () => {
  let service: UserAccountListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAccountListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
