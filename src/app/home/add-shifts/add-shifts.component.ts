import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddShiftsService } from './add-shifts.service';

@Component({
  selector: 'app-add-shifts',
  templateUrl: './add-shifts.component.html',
  styleUrls: ['./add-shifts.component.css']
})
export class AddShiftsComponent implements OnInit {
  addShiftsForm: FormGroup;
  isUniqueSlugComponent: boolean = false;
  invalidForm:boolean = false;

  constructor(private router: Router, private addShift: AddShiftsService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.addShiftsForm = this.formBuilder.group({
      shiftDate: ['', Validators.required],
      shiftStartTime: ['', Validators.required],
      shiftEndTime: ['', Validators.required],
      workplace: ['', Validators.required],
      hourlyWage: ['', Validators.required],
      shiftSlug: ['', Validators.required],
      comments: ['', Validators.required],
    });
  }

  async addShifts() {
      const shifts = {
        shiftDate: this.addShiftsForm.value.shiftDate,
        shiftStartTime: this.addShiftsForm.value.shiftStartTime,
        shiftEndTime: this.addShiftsForm.value.shiftEndTime,
        workplace: this.addShiftsForm.value.workplace,
        hourlyWage:this.addShiftsForm.value.hourlyWage,
        shiftSlug: this.addShiftsForm.value.shiftSlug,
        comments: this.addShiftsForm.value.comments,
      };


      try {
        const isShiftAdded = await this.addShift.addNewShift(shifts);
        if (isShiftAdded) {
          this.isUniqueSlugComponent = false;
          this.addShiftsForm.reset();
          this.router.navigate(['/home']);
          // location.reload();
        }
      } catch (error) {
        // console.error('Error:', error);
        this.isUniqueSlugComponent = true;
      }
  }

  closeAddShift(){
    this.addShiftsForm.reset();
    this.router.navigate(['/home']);
  }

  get shiftDate(){
    return this.addShiftsForm.get('shiftDate');
  }

  get shiftStartTime(){
    return this.addShiftsForm.get('shiftStartTime');
  }

  get shiftEndTime(){
    return this.addShiftsForm.get('shiftEndTime');
  }

  get workplace(){
    return this.addShiftsForm.get('workplace');
  }

  get hourlyWage(){
    return this.addShiftsForm.get('hourlyWage');
  }

  get shiftSlug(){
    return this.addShiftsForm.get('shiftSlug');
  }

  get comments(){
    return this.addShiftsForm.get('comments');
  }

}