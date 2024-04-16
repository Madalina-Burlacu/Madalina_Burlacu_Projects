import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { validate } from 'email-validator';

@Injectable({
  providedIn: 'root',
})
export class ValidateInputsService {
  constructor(private fire: Firestore) {}

  //valid fname & lname
  invalidfname: boolean;
  invalidlname: boolean;
  nameRegex: RegExp = /^[A-Z][a-zA-Z]{1,}$/;

  //valid age
  invalidAge: boolean;

  //valid username
  invalidUsername: boolean;
  usernameRegex: RegExp =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  //valid email
  invalidEmail: boolean;
  emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  //valid password
  invalidPassword: boolean;
  invalidConfirmPass: boolean;
  passwordRegex: RegExp =
    /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,})/;

  //valid department
  isAdmin: boolean;

  async validateUser(
    fName: any,
    lName: any,
    age: any,
    username: any,
    email: any,
    password: any,
    confirmPassword: any
  ): Promise<boolean> {
    this.invalidfname = this.nameRegex.test(fName);
    this.invalidlname = this.nameRegex.test(lName);
    this.invalidAge = age > 17 && age < 66;
    this.invalidUsername = this.usernameRegex.test(username);
    this.invalidEmail = this.emailRegex.test(email);
    this.invalidPassword = this.passwordRegex.test(password);
    this.invalidConfirmPass =
    this.passwordRegex.test(confirmPassword) && confirmPassword === password;

    return (
      this.invalidfname &&
      this.invalidlname &&
      this.invalidAge &&
      this.invalidUsername &&
      this.invalidEmail &&
      this.invalidPassword &&
      this.invalidConfirmPass
    );
  }

  async validDepartment(department: any): Promise<boolean> {
   return department === 'HR';
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
