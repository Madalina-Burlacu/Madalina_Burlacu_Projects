import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUsersAdminComponent } from './all-users-admin.component';

describe('AllUsersAdminComponent', () => {
  let component: AllUsersAdminComponent;
  let fixture: ComponentFixture<AllUsersAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllUsersAdminComponent]
    });
    fixture = TestBed.createComponent(AllUsersAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
