import { TestBed } from '@angular/core/testing';

import { JoinedGuard } from './joined.guard';

describe('JoinedGuard', () => {
  let guard: JoinedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(JoinedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
