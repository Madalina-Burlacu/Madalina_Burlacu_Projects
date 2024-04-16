import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { ForgotpasswordService } from './forgotpassword.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  invalidCredentialsComp: boolean = false;
  showEmailDiv: boolean = false;
  emailForDelete: string = '';
  invalidEmailforDelete: boolean = false;
  completedInputs: boolean = false;
  emailNotFound: boolean = false;
  emailUser:string;
  inputFocused: boolean = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private deleteUserVar: ForgotpasswordService,
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
    });

    this.loginForm.valueChanges.subscribe(() => {
      this.completedInputs =
        this.loginForm.get('email').value &&
        this.loginForm.get('password').value;
    });
  }

  login() {
    const { email, password } = this.loginForm.value;
    this.loginService.loginFunc(email, password).then((loggedIn) => {
      if (loggedIn) {
        this.invalidCredentialsComp = this.loginService.invalidCredentials;
        this.router.navigate(['/home']);
        this.loginForm.reset();
      } else {
        this.invalidCredentialsComp = this.loginService.invalidCredentials;
      }
    });
  }

  showEmailDivOnClick() {
    this.showEmailDiv = true;
  }

  async deleteUser() {
    await this.deleteUserVar.deleteUserByEmail(this.emailForDelete);
  }

  confirmDeleteUser() {
    if (this.emailForDelete.trim() === '') {
      this.invalidEmailforDelete = true;
      return;
    }
  
    this.deleteUserVar.checkUserValidity(this.emailForDelete)
      .then((isUserValid) => {
        if (isUserValid) {
          const userConfirmed = window.confirm('Do you want to delete the user?');
          if (userConfirmed) {
            this.deleteUserVar.deleteUserByEmail(this.emailForDelete)
              .then(() => {
                this.showEmailDiv = false;
                this.emailForDelete = '';
              })
              .catch((error) => {
                console.error('Error deleting user:', error);
              });
          }
        } else {
          this.emailNotFound = true;
        }
      })
      .catch((error) => {
        console.error('Error checking user validity:', error);
      });
  }
  
  closeDelete() {
    this.showEmailDiv = false;
    this.emailForDelete = '';
    this.resetErrors()
  }

  resetErrors() {
    this.inputFocused = true;
  }
  
  checkErrors() {
    this.inputFocused = false;
  }

}

