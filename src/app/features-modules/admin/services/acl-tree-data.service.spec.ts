import { TestBed } from '@angular/core/testing';

import { AclTreeDataService } from './acl-tree-data.service';

describe('AclTreeDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AclTreeDataService = TestBed.get(AclTreeDataService);
    expect(service).toBeTruthy();
  });
});
