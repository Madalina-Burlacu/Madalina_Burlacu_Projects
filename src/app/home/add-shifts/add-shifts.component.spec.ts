import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShiftsComponent } from './add-shifts.component';

describe('AddShiftsComponent', () => {
  let component: AddShiftsComponent;
  let fixture: ComponentFixture<AddShiftsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddShiftsComponent]
    });
    fixture = TestBed.createComponent(AddShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
