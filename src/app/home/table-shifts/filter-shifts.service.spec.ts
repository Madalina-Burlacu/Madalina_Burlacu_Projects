import { TestBed } from '@angular/core/testing';

import { FilterShiftsService } from './filter-shifts.service';

describe('FilterShiftsService', () => {
  let service: FilterShiftsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterShiftsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
