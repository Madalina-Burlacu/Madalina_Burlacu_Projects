import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

//firebase
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore, Firestore } from '@angular/fire/firestore';

//components
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './home/footer/footer.component';
import { NavBarComponent } from './home/nav-bar/nav-bar.component';
import { TableShiftsComponent } from './home/table-shifts/table-shifts.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

//services
import { RegisterService } from './register/register.service';
import { ValidateInputsService } from './register/validate-inputs.service';
import { ErrorPageComponent } from './error-page/error-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngMaterialModule } from './ang-material/ang-material.module';
import { AddShiftsComponent } from './home/add-shifts/add-shifts.component';
import { EditShiftsComponent } from './home/edit-shifts/edit-shifts.component';
import { EditUserComponent } from './home/edit-user/edit-user.component';
import { AddShiftsService } from './home/add-shifts/add-shifts.service';
import { LoginService } from './login/login.service';
import { DisplayShiftsUserService } from './home/table-shifts/display-shifts-user.service';
import { EditShiftUserService } from './home/edit-shifts/edit-shift-user.service';
import { FilterShiftsService } from './home/table-shifts/filter-shifts.service';
import { AllUsersAdminComponent } from './home/all-users-admin/all-users-admin.component';
import { NavBarSimpleComponent } from './home/nav-bar-simple/nav-bar-simple.component';
import { AdminEditProfileComponent } from './home/admin-edit-profile/admin-edit-profile.component';
import { AllShiftsAdminComponent } from './home/all-shifts-admin/all-shifts-admin.component';
import { EditShiftAdminComponent } from './home/edit-shift-admin/edit-shift-admin.component';
import { ForgotpasswordService } from './login/forgotpassword.service';
import { EditUserProfileService } from './home/edit-user/edit-user-profile.service';
import { AllUsersAndShiftsService } from './home/all-users-and-shifts.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    FooterComponent,
    NavBarComponent,
    TableShiftsComponent,
    ErrorPageComponent,
    AddShiftsComponent,
    EditShiftsComponent,
    EditUserComponent,
    AllUsersAdminComponent,
    NavBarSimpleComponent,
    AdminEditProfileComponent,
    AllShiftsAdminComponent,
    EditShiftAdminComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule,
    AngMaterialModule,
    HttpClientModule
  ],
  providers: [
    ScreenTrackingService,UserTrackingService,RegisterService,ValidateInputsService,LoginService,ForgotpasswordService,AddShiftsService,DisplayShiftsUserService,
    EditShiftUserService,FilterShiftsService,EditUserProfileService,AllUsersAndShiftsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
