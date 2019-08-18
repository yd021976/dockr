import { TestBed, async, inject } from '@angular/core/testing';

import { AclCanDeactivateGuard } from './acl.guard';

describe('AclGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AclCanDeactivateGuard]
    });
  });

  it('should ...', inject([AclCanDeactivateGuard], (guard: AclCanDeactivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
