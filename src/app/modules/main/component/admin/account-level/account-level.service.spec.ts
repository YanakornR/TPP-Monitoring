import { TestBed } from '@angular/core/testing';

import { AccountLevelService } from './account-level.service';

describe('AccountLevelService', () => {
  let service: AccountLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountLevelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
