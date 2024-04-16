import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/login/login.service';
import { DisplayShiftsUserService } from './display-shifts-user.service';
import { FilterShiftsService } from './filter-shifts.service';

@Component({
  selector: 'app-table-shifts',
  templateUrl: './table-shifts.component.html',
  styleUrls: ['./table-shifts.component.css']
})
export class TableShiftsComponent implements OnInit{
  startDate: any = null;
  endDate: any = null;
  shiftsWorkplaceFilter: any = null;
  currentUser: any | null;
  shifts: any | null;
  mostProfitableMonth: any | null;

  constructor(private loginServices: LoginService, private displayShiftsService: DisplayShiftsUserService, private filterShiftsService: FilterShiftsService){}
  
  async ngOnInit(): Promise<void> {
    (await this.loginServices.getCurrentUser()).subscribe(async (user:any) =>{
      if(user && user.shifts){
        this.currentUser = user;
        this.shifts = user.shifts;
        await this.calculateMostProfitableMonth();
        this.mostProfitableMonth = await this.calculateMostProfitableMonth()
      }
      else{
        return;
      }

    })


  }

  async delete(shiftSlug: string) {
    try {
      if (this.currentUser && this.currentUser.shifts) {
        (await this.displayShiftsService.deleteShift(shiftSlug)).subscribe(async (data) => {
          this.shifts = data;
          this.mostProfitableMonth = await this.calculateMostProfitableMonth()
        });
      } else {
        console.log('User does not have shifts to delete.');
      }
    } catch (err) {
      console.log('Error in deleting shift!');
    }
  }

  async searchByDate(){
    (await this.filterShiftsService.getShiftsForRegularUserDate(this.startDate, this.endDate)).subscribe(async (data) =>{
      this.shifts = data;
      this.mostProfitableMonth = await this.calculateMostProfitableMonth()
    })

  }

  async searchByShiftWorkplace(){
    (await this.filterShiftsService.getShiftsForRegularUserShiftWorkplace(this.shiftsWorkplaceFilter)).subscribe(async (data) =>{
      this.shifts = data;
      this.mostProfitableMonth = await this.calculateMostProfitableMonth()
    })
  }

  async resetFilter() {
    (await this.filterShiftsService.resetFilter()).subscribe(async (data) => {
      this.shifts = data;
      this.startDate = null;
      this.endDate = null;
      this.shiftsWorkplaceFilter = null;
      this.mostProfitableMonth = await this.calculateMostProfitableMonth()
    });
  }

  async calculateMostProfitableMonth() {
    const monthlyEarnings = {};
    
    if (this.shifts) {
      this.shifts.forEach((shift: { shiftDate: string | number | Date; dailyPay: any; }) => {
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
  
      let mostProfitableMonth = '';
      let maxEarnings = 0;
  
      for (const month in monthlyEarnings) {
        if (monthlyEarnings[month] > maxEarnings) {
          mostProfitableMonth = month;
          maxEarnings = monthlyEarnings[month];
        }
  
      }
  
      return { month: mostProfitableMonth, earnings: maxEarnings };
    } else {
      return { month: '', earnings: 0 };
    }
  }
}
