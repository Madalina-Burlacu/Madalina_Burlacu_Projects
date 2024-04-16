import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllShiftsAdminComponent } from './all-shifts-admin.component';

describe('AllShiftsAdminComponent', () => {
  let component: AllShiftsAdminComponent;
  let fixture: ComponentFixture<AllShiftsAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllShiftsAdminComponent]
    });
    fixture = TestBed.createComponent(AllShiftsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
