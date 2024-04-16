import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AllUsersAndShiftsService } from '../all-users-and-shifts.service';

@Component({
  selector: 'app-all-shifts-admin',
  templateUrl: './all-shifts-admin.component.html',
  styleUrls: ['./all-shifts-admin.component.css'],
})
export class AllShiftsAdminComponent implements OnInit {
  startDate: any;
  endDate: any;
  shiftsPlaceFilter: string;
  user: any;
  shifts: any;
  shiftsFiltered: any = undefined;
  fNameFilter: string = '';
  lNameFilter: string = '';
  idFilter: string = '';
  uidUserFiltered: any;
  currentUserUid: string;
  userWithMostShifts: any;
  mostProfitableMonth: { month: string, earnings: number } | null = null;

  constructor(
    private allShiftsServices: AllUsersAndShiftsService,
    private route: Router
  ) {}

  async ngOnInit(): Promise<void> {
    (await this.allShiftsServices.getAllUsersAndShifts()).subscribe(async (data) => {
      this.shifts = data;
      await this.findUserWithMostShifts();
      this.userWithMostShifts = await this.findUserWithMostShifts();
      await this.calculateMostProfitableMonth();
    });
  }

  async searchByDate() {
    if (this.startDate && this.endDate) {
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);

      this.allShiftsServices
        .getShiftsByDate(startDate, endDate)
        .subscribe(async (filteredShifts) => {
          this.shiftsFiltered = filteredShifts;
          await this.findUserWithMostShifts();
          this.userWithMostShifts = await this.findUserWithMostShifts();
        });

    }
  }

  async searchByShiftWorkplace() {
    if (this.shiftsPlaceFilter) {
      (
        await this.allShiftsServices.getShiftsByWorkplaceIfAdmin(
          this.shiftsPlaceFilter
        )
      ).subscribe(async (filteredShifts) => {
        this.shiftsFiltered = filteredShifts;
        await this.findUserWithMostShifts();
        this.userWithMostShifts = await this.findUserWithMostShifts();
      });

    }
  }

  async resetFilter() {
    this.startDate = '';
    this.endDate = '';
    this.shiftsPlaceFilter = '';
    this.shiftsFiltered = undefined;
    (await this.allShiftsServices.getAllUsersAndShifts()).subscribe(
      async (data: any) => {
        this.shifts = data;
        await this.findUserWithMostShifts();
        this.userWithMostShifts = await this.findUserWithMostShifts();
      },
      (error) => {
        console.error('Eroare la obținerea datelor:', error);
      }
    );
  }

  close() {
    this.route.navigate(['home']);
  }

  async delete(uidUser: any, shiftId: any) {
    (
      await this.allShiftsServices.deleteShiftUserIfAdmin(uidUser, shiftId)
    ).subscribe(async (data) => {
      this.shifts = data;
      await this.findUserWithMostShifts();
      this.userWithMostShifts = await this.findUserWithMostShifts();
    });
  }

  async findUserWithMostShifts() {
    if (this.shifts) {
      const usersWithoutCurrentUser = this.shifts.filter(
        (user: { uid: string; }) => user.uid !== this.currentUserUid
      );
  
      const maxShifts = usersWithoutCurrentUser.reduce(
        (maxShifts: number, currentUser: { shifts: string | any[]; }) =>
          Math.max(maxShifts, currentUser.shifts.length),
        0
      );
  
      const withMostShifts = usersWithoutCurrentUser.filter(
        (user: { shifts: string | any[]; }) => user.shifts.length === maxShifts
      );
  
      return { user: withMostShifts, countShifts: maxShifts };
    } else {
      return null;
    }
  }
  
  async calculateMostProfitableMonth() {
    const usersWithoutCurrentUser = this.shifts.filter(user => user.uid !== this.currentUserUid);
  
    const monthlyEarnings = {};

    usersWithoutCurrentUser.forEach(user => {
      user.shifts.forEach(shift => {
        const shiftDate = new Date(shift.shiftDate);
        const monthYear =
          shiftDate.toLocaleString('default', { month: 'long' }) +
          ' ' +
          shiftDate.getFullYear();
  
        if (!monthlyEarnings[monthYear]) {
          monthlyEarnings[monthYear] = 0;
        }
  
        monthlyEarnings[monthYear] += shift.dailyPay;
      });
    });
  
    let mostProfitableMonth = '';
    let maxEarnings = 0;
  
    for (const month in monthlyEarnings) {
      if (monthlyEarnings[month] > maxEarnings) {
        mostProfitableMonth = month;
        maxEarnings = monthlyEarnings[month];
      }
    }
  
    this.mostProfitableMonth = { month: mostProfitableMonth, earnings: maxEarnings };
  }
  
}
