import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AllUsersAndShiftsService } from '../all-users-and-shifts.service';
import { ValidateInputsService } from 'src/app/register/validate-inputs.service';

@Component({
  selector: 'app-admin-edit-profile',
  templateUrl: './admin-edit-profile.component.html',
  styleUrls: ['./admin-edit-profile.component.css']
})
export class AdminEditProfileComponent implements OnInit {
  editProfileIfAdmin:FormGroup;
  userUid:any;
  profilUpdated:boolean = false;

  constructor(private allUsersService: AllUsersAndShiftsService, private activatedRoute: ActivatedRoute, private route: Router, private validUser: ValidateInputsService){

  }

  async ngOnInit(): Promise<void> {
    this.editProfileIfAdmin = new FormGroup({
      uid: new FormControl(''),
      editfName: new FormControl('', [Validators.required, Validators.pattern(this.validUser.nameRegex)]),
      editlName: new FormControl('', [Validators.required, Validators.pattern(this.validUser.nameRegex)]),
      editage: new FormControl('', [Validators.required, Validators.min(18), Validators.max(65)]),
      editusername: new FormControl('', [Validators.required, Validators.pattern(this.validUser.usernameRegex)]),
      editemail: new FormControl('', [Validators.required, this.emailFormatValidator]),
      editpassword: new FormControl('', [Validators.required, Validators.pattern(this.validUser.passwordRegex)])
    })

    this.userUid = this.activatedRoute.snapshot.paramMap.get('id');

    (await this.allUsersService.getUserByUidIfAdmin(this.userUid)).subscribe((data) =>{
      this.editProfileIfAdmin.patchValue({
        uid: data['uid'],
        editfName: data['fName'],
        editlName: data['lName'],
        editage: data['age'],
        editusername: data['username'],
        editemail: data['email'],
        editpassword: data['password']
      })
    })
  }

  async editProfile(){
    const newData = {
      fName: this.editProfileIfAdmin.value.editfName,
      lName: this.editProfileIfAdmin.value.editlName,
      age: this.editProfileIfAdmin.value.editage,
      username:this.editProfileIfAdmin.value.editusername,
      email: this.editProfileIfAdmin.value.editemail,
      password: this.editProfileIfAdmin.value.editpassword,
    };
    (await this.allUsersService.updateProfileUserIfAdmin(this.userUid, newData)).subscribe(() =>{
      this.profilUpdated = true;
      this.route.navigate(['/home/admin/allusers']);
    })
  }


  closeEditProfile(){
    this.route.navigate(['/home/admin/allusers']);
  }

  emailFormatValidator(control: FormControl){
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(control.value)) {
      return { invalidEmail: true };
    }

    return null;
  }

  get editfName(){
    return this.editProfileIfAdmin.get('editfName');
  }

  get editlName(){
    return this.editProfileIfAdmin.get('editlName');
  }

  get editage(){
    return this.editProfileIfAdmin.get('editage');
  }

  get editusername(){
    return this.editProfileIfAdmin.get('editusername');
  }

  get editemail(){
    return this.editProfileIfAdmin.get('editemail');
  }

  get editpassword(){
    return this.editProfileIfAdmin.get('editpassword');
  }
}
