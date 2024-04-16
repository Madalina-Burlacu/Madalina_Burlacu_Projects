import { TestBed } from '@angular/core/testing';

import { EditShiftUserService } from './edit-shift-user.service';

describe('EditShiftUserService', () => {
  let service: EditShiftUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditShiftUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
