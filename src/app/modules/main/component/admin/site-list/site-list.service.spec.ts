import { TestBed } from '@angular/core/testing';

import { SiteListService } from './site-list.service';

describe('SiteListService', () => {
  let service: SiteListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
