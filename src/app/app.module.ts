import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { RouterModule } from "@angular/router"
import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { RegisterComponent } from "./components/auth/register/register.component"
import { LoginComponent } from "./components/auth/login/login.component"
import { HomeComponent } from "./components/home/home.component"
import { DoctorListComponent } from "./components/doctors/doctor-list/doctor-list.component"
import { DoctorDetailComponent } from "./components/doctors/doctor-detail/doctor-detail.component"
import { ServiceListComponent } from "./components/services/service-list/service-list.component"
import { AppointmentComponent } from "./components/appointments/appointment/appointment.component"
import { UserDashboardComponent } from "./components/dashboard/user-dashboard/user-dashboard.component"
import { HeaderComponent } from "./components/shared/header/header.component"
import { FooterComponent } from "./components/shared/footer/footer.component"
import { StarRatingComponent } from "./components/shared/star-rating/star-rating.component"
import { TestimonialsComponent } from "./components/shared/testimonials/testimonials.component"
import { AppointmentHistoryComponent } from "./components/dashboard/appointment-history/appointment-history.component"
import { ProfileEditComponent } from "./components/dashboard/profile-edit/profile-edit.component"
import { ServiceCardComponent } from "./components/services/service-card/service-card.component"
import { DoctorCardComponent } from "./components/doctors/doctor-card/doctor-card.component"
import { AuthGuard } from "./guards/auth.guard";
import { AddServiceComponent } from './components/services/add-service/add-service.component';
import { MedicalClinicFormComponent } from './components/admin/medical-clinic-form/medical-clinic-form.component';
import { ClinicListComponent } from './components/admin/clinic-list/clinic-list.component';
import { UpdateMedicalClinicComponent } from './components/admin/update-medical-clinic/update-medical-clinic.component';



@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    DoctorListComponent,
    DoctorDetailComponent,
    ServiceListComponent,
    AppointmentComponent,
    UserDashboardComponent,
    HeaderComponent,
    FooterComponent,
    StarRatingComponent,
    TestimonialsComponent,
    AppointmentHistoryComponent,
    ProfileEditComponent,
    ServiceCardComponent,
    DoctorCardComponent,
    AddServiceComponent,
    MedicalClinicFormComponent,
    ClinicListComponent,
    UpdateMedicalClinicComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule,

  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
