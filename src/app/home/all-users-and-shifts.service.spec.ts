import { TestBed } from '@angular/core/testing';

import { AllUsersAndShiftsService } from './all-users-and-shifts.service';

describe('AllUsersAndShiftsService', () => {
  let service: AllUsersAndShiftsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllUsersAndShiftsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
