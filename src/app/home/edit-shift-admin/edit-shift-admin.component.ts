import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AllUsersAndShiftsService } from '../all-users-and-shifts.service';

@Component({
  selector: 'app-edit-shift-admin',
  templateUrl: './edit-shift-admin.component.html',
  styleUrls: ['./edit-shift-admin.component.css']
})
export class EditShiftAdminComponent implements OnInit {
  editShiftFormAdmin:FormGroup;
  idEdited: string;
  uidUserEdited: string;
  shiftSlugEdited: string;

  constructor(private route: ActivatedRoute, private editShiftAdminService: AllUsersAndShiftsService, private router: Router){}

  async ngOnInit(): Promise<void> {
    this.editShiftFormAdmin = new FormGroup({
      editShiftDate: new FormControl('', Validators.required),
      editShiftStartTime: new FormControl('', Validators.required),
      editShiftEndTime: new FormControl('', Validators.required),
      editWorkplace: new FormControl('', Validators.required),
      editHourlyWage: new FormControl('', Validators.required),
      editShiftSlug: new FormControl({value: '', disabled: true}),
      editComments: new FormControl('', Validators.required),
    })
    this.uidUserEdited = this.route.snapshot.paramMap.get('id1');
    this.shiftSlugEdited = this.route.snapshot.paramMap.get('id2');


    (await this.editShiftAdminService.getShiftByIdIfAdmin(this.uidUserEdited, this.shiftSlugEdited)).subscribe((data) =>{
      if(data){
        this.editShiftFormAdmin.patchValue({
          editShiftDate: data['shiftDate'],
          editShiftStartTime: data['shiftStartTime'],
          editShiftEndTime: data['shiftEndTime'],
          editWorkplace: data['workplace'],
          editHourlyWage: data['hourlyWage'],
          editShiftSlug:data['shiftSlug'],
          editComments: data['comments'],
        });
      }
    })
 
  }

  async editShift(){
    const hourlyWage = parseFloat(this.editShiftFormAdmin.value.editHourlyWage);
    const startShift = parseFloat(this.editShiftFormAdmin.value.editShiftStartTime);
    const endShift = parseFloat(this.editShiftFormAdmin.value.editShiftEndTime);

    if (!isNaN(hourlyWage) && !isNaN(startShift) && !isNaN(endShift)) {
      const dailyPay = this.editShiftAdminService.calculateDayliPay(hourlyWage, startShift, endShift);
      const shiftUpdated = {
        shiftDate: this.editShiftFormAdmin.value.editShiftDate,
        shiftStartTime: this.editShiftFormAdmin.value.editShiftStartTime,
        shiftEndTime: this.editShiftFormAdmin.value.editShiftEndTime,
        workplace: this.editShiftFormAdmin.value.editWorkplace,
        hourlyWage: this.editShiftFormAdmin.value.editHourlyWage,
        shiftSlug: this.shiftSlugEdited,
        comments: this.editShiftFormAdmin.value.editComments,
        dailyPay: dailyPay,
      };
      (await this.editShiftAdminService.updateShiftIfAdmin(this.uidUserEdited, this.shiftSlugEdited, shiftUpdated)).subscribe(() =>{
        this.router.navigate(['/home/admin/allshifts']);
      });
    }else{
      console.log('Invalid input for hourly wage, start time, or end time');
    }


  };

  closeEditShift(){
    this.router.navigate(['/home/admin/allshifts']);
  }

  get editShiftDate (){
    return this.editShiftFormAdmin.get('editShiftDate: ');
  }

  get editShiftStartTime(){
    return this.editShiftFormAdmin.get('editShiftStartTime');
  }

  get editShiftEndTime(){
    return this.editShiftFormAdmin.get('editShiftEndTime');
  }

  get editWorkplace(){
    return this.editShiftFormAdmin.get('editWorkplace');
  }

  get editHourlyWage(){
    return this.editShiftFormAdmin.get('editHourlyWage');
  }

  get editComments(){
    return this.editShiftFormAdmin.get('editComments');
  }
}
