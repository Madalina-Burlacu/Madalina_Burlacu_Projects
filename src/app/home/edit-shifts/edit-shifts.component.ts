import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditShiftUserService } from './edit-shift-user.service';

@Component({
  selector: 'app-edit-shifts',
  templateUrl: './edit-shifts.component.html',
  styleUrls: ['./edit-shifts.component.css'],
})
export class EditShiftsComponent implements OnInit{
  editShiftForm: FormGroup;
  shiftSlugVar: any;

  constructor(private router: Router, private editShiftService: EditShiftUserService, private route: ActivatedRoute){

  }

  async ngOnInit(): Promise<void> {
    this.editShiftForm = new FormGroup({
      editShiftDate: new FormControl('', Validators.required),
      editShiftStartTime: new FormControl('', Validators.required),
      editShiftEndTime: new FormControl('', Validators.required),
      editWorkplace: new FormControl('', Validators.required),
      editHourlyWage: new FormControl('', Validators.required),
      editShiftSlug: new FormControl({value: '', disabled: true}),
      editComments: new FormControl('', Validators.required)
    })

    this.route.params.subscribe((params) => {
      this.shiftSlugVar = params['shiftSlug'];
    });
  
    (await this.editShiftService.getShiftByShiftSlug(this.shiftSlugVar)).subscribe((data) =>{
      if(data && data['shiftDate']){
        this.editShiftForm.patchValue({
          editShiftDate: data['shiftDate'],
          editShiftStartTime: data['shiftStartTime'],
          editShiftEndTime: data['shiftEndTime'],
          editWorkplace: data['workplace'],
          editHourlyWage: data['hourlyWage'],
          editShiftSlug: data['shiftSlug'],
          editComments: data['comments'],
        })
      }

    });
  }

  async editShift() {
    const hourlyWage = parseFloat(this.editShiftForm.value.editHourlyWage);
    const startShift = parseFloat(this.editShiftForm.value.editShiftStartTime);
    const endShift = parseFloat(this.editShiftForm.value.editShiftEndTime);

    if (!isNaN(hourlyWage) && !isNaN(startShift) && !isNaN(endShift)) {

      const dailyPay = this.editShiftService.calculateDayliPay(hourlyWage, startShift, endShift);

      const shiftUpdated = {
        shiftDate: this.editShiftForm.value.editShiftDate,
        shiftStartTime: this.editShiftForm.value.editShiftStartTime,
        shiftEndTime: this.editShiftForm.value.editShiftEndTime,
        workplace: this.editShiftForm.value.editWorkplace,
        hourlyWage: this.editShiftForm.value.editHourlyWage,
        shiftSlug: this.shiftSlugVar,
        dailyPay: dailyPay,
        comments: this.editShiftForm.value.editComments,
      };
  
      (await this.editShiftService.updateShfit(this.shiftSlugVar, shiftUpdated)).subscribe(() => {
        this.router.navigate(['/home']);
      });
    } else {
      console.log('Invalid input for hourly wage, start time, or end time');
    }
  }
  

  closeEditShift(){
    this.editShiftForm.reset();
    this.router.navigate(['/home']);
  }


  get editShiftDate (){
    return this.editShiftForm.get('editShiftDate: ');
  }

  get editShiftStartTime(){
    return this.editShiftForm.get('editShiftStartTime');
  }

  get editShiftEndTime(){
    return this.editShiftForm.get('editShiftEndTime');
  }

  get editWorkplace(){
    return this.editShiftForm.get('editWorkplace');
  }

  get editHourlyWage(){
    return this.editShiftForm.get('editHourlyWage');
  }

  get editComments(){
    return this.editShiftForm.get('editComments');
  }
}
