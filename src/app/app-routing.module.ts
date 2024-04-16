import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { EditShiftsComponent } from './home/edit-shifts/edit-shifts.component';
import { AddShiftsComponent } from './home/add-shifts/add-shifts.component';
import { EditUserComponent } from './home/edit-user/edit-user.component';
import { AllUsersAdminComponent } from './home/all-users-admin/all-users-admin.component';
import { AdminEditProfileComponent } from './home/admin-edit-profile/admin-edit-profile.component';
import { AllShiftsAdminComponent } from './home/all-shifts-admin/all-shifts-admin.component';
import { EditShiftAdminComponent } from './home/edit-shift-admin/edit-shift-admin.component';

const routes: Routes = [
  {path: 'registerpage', component: RegisterComponent},
  {path: 'loginpage', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'addshifts', component: AddShiftsComponent},
  {path: 'user/editshift/:shiftSlug', component: EditShiftsComponent},
  {path: 'user/editprofile', component: EditUserComponent},
  {path: 'home/admin/allusers', component: AllUsersAdminComponent},
  {path: 'home/admin/editprofile/:id', component: AdminEditProfileComponent},
  {path: 'home/admin/allshifts', component: AllShiftsAdminComponent},
  {path: 'home/admin/editshift/:id1/:id2', component: EditShiftAdminComponent },
  {path: '', pathMatch: 'full', redirectTo: 'registerpage'},
  {path: '404', component: ErrorPageComponent},
  {path: '**', component: ErrorPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
