import { TestBed } from '@angular/core/testing';

import { NmModuleListService } from './nm-module-list.service';

describe('NmModuleListService', () => {
  let service: NmModuleListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NmModuleListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
