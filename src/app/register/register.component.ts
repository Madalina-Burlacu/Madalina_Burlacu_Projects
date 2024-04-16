import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { EmailValidator, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from './register.service';
import { Router } from '@angular/router';
import { ValidateInputsService } from './validate-inputs.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  validData: boolean = false;
  emailExist: boolean = false;
  usernameExist: boolean = false;

  constructor(
    private userDatabase: RegisterService,
    private router: Router,
    private validUser: ValidateInputsService
  ) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      fName: new FormControl('', [Validators.required, Validators.pattern(this.validUser.nameRegex)]),
      lName: new FormControl('', [Validators.required, Validators.pattern(this.validUser.nameRegex)]),
      age: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required, Validators.pattern(this.validUser.usernameRegex)]),
      email: new FormControl('', [Validators.required, this.emailFormatValidator]),
      password: new FormControl('', [Validators.required, Validators.pattern(this.validUser.passwordRegex)]),
      confirmPassword: new FormControl('', [Validators.required]),
      shifts: new FormControl([])
    }, {validators: [this.validUser.passwordMatchValidator]});
  }

  validEmail = this.validUser.invalidEmail;

  async addUser() {
    const {
      fName,
      lName,
      age,
      department,
      username,
      email,
      password,
      confirmPassword,
      shifts
    } = this.registerForm.value;

    const isValid = await this.validUser.validateUser(
      fName,
      lName,
      age,
      username,
      email,
      password,
      confirmPassword,
      
    );
    this.validData = !isValid;

    this.emailExist = await this.userDatabase.emailExist(email);
    this.usernameExist = await this.userDatabase.usernameExist(username);

    if (this.usernameExist) {
      return;
    } else {
      this.usernameExist = false;
    }

    if (this.emailExist) {
      return;
    } else {
      this.emailExist = false;
    }

    if (isValid) {
      const isAdmin = await this.validUser.validDepartment(department);

      await this.userDatabase
        .addUser(
          fName,
          lName,
          age,
          isAdmin,
          username,
          email,
          password,
          shifts
        )
        .then(() => {
          this.registerForm.reset();
          this.router.navigate(['/loginpage']);
        })
        .catch((error) => {
          console.log('Error in adding user', error);
        });
    } else {
      return;
    }
  }

  emailFormatValidator(control: FormControl){
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(control.value)) {
      return { invalidEmail: true };
    }

    return null;
  }

  get fName(){
    return this.registerForm.get('fName');
  }

  get lName(){
    return this.registerForm.get('lName');
  }

  get age(){
    return this.registerForm.get('age');
  }

  get department(){
    return this.registerForm.get('department');
  }

  get username(){
    return this.registerForm.get('username');
  }

  get email(){
    return this.registerForm.get('email');
  }

  get password(){
    return this.registerForm.get('password');
  }

  get confirmPassword(){
    return this.registerForm.get('confirmPassword');
  }
}
