import { TestBed } from '@angular/core/testing';

import { DisplayShiftsUserService } from './display-shifts-user.service';

describe('DisplayShiftsUserService', () => {
  let service: DisplayShiftsUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayShiftsUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
