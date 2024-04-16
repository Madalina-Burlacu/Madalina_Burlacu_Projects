import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login/login.service';
import { EditUserProfileService } from './edit-user-profile.service';
import { ValidateInputsService } from 'src/app/register/validate-inputs.service';
import { RegisterService } from 'src/app/register/register.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  editProfileForm: FormGroup;
  profilUpdated: boolean = false;

  constructor(private router: Router, private editUserService: EditUserProfileService, private loggedUser: LoginService, private validUser: ValidateInputsService){}

  async ngOnInit(): Promise<void> {
    this.editProfileForm = new FormGroup({
      editfName: new FormControl('', [Validators.required, Validators.pattern(this.validUser.nameRegex)]),
      editlName: new FormControl('', [Validators.required, Validators.pattern(this.validUser.nameRegex)]),
      editage: new FormControl('', [Validators.required, Validators.min(18), Validators.max(65)]),
      editusername: new FormControl('', [Validators.required, Validators.pattern(this.validUser.usernameRegex)]),
      editemail: new FormControl('', [Validators.required, this.emailFormatValidator]),
      editpassword: new FormControl('', [Validators.required, Validators.pattern(this.validUser.passwordRegex)]),
    });
    (await this.loggedUser.getCurrentUser()).subscribe((data) =>{
      if(data){
        this.editProfileForm.patchValue({
          editfName: data['fName'],
          editlName: data['lName'],
          editage: data['age'],
          editusername: data['username'],
          editemail: data['email'],
          editpassword: data['password'],
        })
      }
    })
  }

  async editProfile(){
    const profileInfo = {
      fName: this.editProfileForm.value.editfName,
      lName: this.editProfileForm.value.editlName,
      age: this.editProfileForm.value.editage,
      username: this.editProfileForm.value.editusername,
      email: this.editProfileForm.value.editemail,
      password: this.editProfileForm.value.editpassword,
    };
    (await this.editUserService.updateProfileUser(profileInfo)).subscribe(() => {
      this.profilUpdated = true;
        this.router.navigate(['/home']);

        })
  }

  emailFormatValidator(control: FormControl){
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(control.value)) {
      return { invalidEmail: true };
    }

    return null;
  }

  closeEditProfile(){
    this.editProfileForm.reset();
    this.router.navigate(['/home']);
  }

  get editfName(){
    return this.editProfileForm.get('editfName');
  }

  get editlName(){
    return this.editProfileForm.get('editlName');
  }

  get editage(){
    return this.editProfileForm.get('editage');
  }

  get editusername(){
    return this.editProfileForm.get('editusername');
  }

  get editemail(){
    return this.editProfileForm.get('editemail');
  }

  get editpassword(){
    return this.editProfileForm.get('editpassword');
  }

}
