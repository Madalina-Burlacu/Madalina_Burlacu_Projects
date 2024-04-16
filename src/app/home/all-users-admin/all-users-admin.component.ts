import { Component, OnInit } from '@angular/core';
import { AllUsersAndShiftsService } from '../all-users-and-shifts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-users-admin',
  templateUrl: './all-users-admin.component.html',
  styleUrls: ['./all-users-admin.component.css'],
})
export class AllUsersAdminComponent implements OnInit {
  users: any;
  lNameUser: string;

  constructor(
    private route: Router,
    private allUsersService: AllUsersAndShiftsService
  ) {}

  async ngOnInit(): Promise<void> {
    (await this.allUsersService.getAllUsersAndShifts()).subscribe(
      (data: any) => {
        this.users = data;
      }
    );
  }


  async deleteUser(uidUser: any) {
    (await this.allUsersService.deleteUser(uidUser)).subscribe((data) =>{
      this.users = data;
    })
  }

  async searchByName() {
    this.users = this.users.filter((user: any) =>
    (user.fName.toLowerCase().includes(this.lNameUser.toLowerCase()) || 
    user.lName.toLowerCase().includes(this.lNameUser.toLowerCase()))
  );
  }

  async resetFilter() {
    this.lNameUser = '';
    (await this.allUsersService.getAllUsersAndShifts()).subscribe(
      (data: any) => {
        this.users = data;
      },
      (error) => {
        console.error("Eroare la obținerea datelor:", error);
      }
    );
  }

  close() {
    this.route.navigate(['home']);
  }
}
