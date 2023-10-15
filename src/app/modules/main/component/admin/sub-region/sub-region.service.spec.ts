import { TestBed } from '@angular/core/testing';

import { SubRegionService } from './sub-region.service';

describe('SubRegionService', () => {
  let service: SubRegionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubRegionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
