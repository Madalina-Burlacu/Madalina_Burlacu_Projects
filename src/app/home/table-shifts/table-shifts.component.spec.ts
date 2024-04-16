import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableShiftsComponent } from './table-shifts.component';

describe('TableShiftsComponent', () => {
  let component: TableShiftsComponent;
  let fixture: ComponentFixture<TableShiftsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableShiftsComponent]
    });
    fixture = TestBed.createComponent(TableShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
