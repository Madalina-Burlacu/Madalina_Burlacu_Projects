import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login/login.service';
import { from } from 'rxjs';
import { getAuth, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit{
  menubar: boolean = false;
  currentUser: any | null;
  isAdminUser: boolean = false;

  constructor(private loginServices: LoginService, private route: Router){

  }
  async ngOnInit(): Promise<void> {
    (await this.loginServices.getCurrentUser()).subscribe((user: any) => {
      this.currentUser = user;
      if(user){
        this.isAdminUser = user.isAdmin;
        if (this.currentUser && this.currentUser.fName) {
          return;
        } else {
          return;
        }
      }
      else{
        this.isAdminUser = false;
      }

    });
   }

  showEditShifts(){
    this.route.navigate(['addshifts']);
  }

  showEditProfile(){
    this.route.navigate(['user/editprofile']);
  }

  showAllUsers(){
    this.route.navigate(['/home/admin/allusers']);
  }

  showAllShifts(){
    this.route.navigate(['home/admin/allshifts']);
  }


  logOut() {
    const auth = getAuth();
    if (auth.currentUser) {
      const userConfirmed = window.confirm('Do you want to disconnect?');
      if (userConfirmed) {
        signOut(auth).then(() => {
          this.route.navigate(['loginpage']);
        }).catch((error) => {
          console.error('Error to disconnect:', error);
        });
      }
    }
  }
}
