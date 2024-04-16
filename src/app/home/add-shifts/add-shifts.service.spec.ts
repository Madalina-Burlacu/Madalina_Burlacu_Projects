import { TestBed } from '@angular/core/testing';

import { AddShiftsService } from './add-shifts.service';

describe('AddShiftsService', () => {
  let service: AddShiftsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddShiftsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
