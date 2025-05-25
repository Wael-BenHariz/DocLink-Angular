import { NgModule } from "@angular/core"
import { RouterModule, type Routes } from "@angular/router"
import { HomeComponent } from "./components/home/home.component"
import { RegisterComponent } from "./components/auth/register/register.component"
import { LoginComponent } from "./components/auth/login/login.component"
import { DoctorListComponent } from "./components/doctors/doctor-list/doctor-list.component"
import { DoctorDetailComponent } from "./components/doctors/doctor-detail/doctor-detail.component"
import { ServiceListComponent } from "./components/services/service-list/service-list.component"
import { AppointmentComponent } from "./components/appointments/appointment/appointment.component"
import { UserDashboardComponent } from "./components/dashboard/user-dashboard/user-dashboard.component"
import { ProfileEditComponent } from "./components/dashboard/profile-edit/profile-edit.component"
import { AppointmentHistoryComponent } from "./components/dashboard/appointment-history/appointment-history.component"
import { AuthGuard } from "./guards/auth.guard"
import { AddServiceComponent } from "./components/services/add-service/add-service.component"
import { MedicalClinicFormComponent } from "./components/admin/medical-clinic-form/medical-clinic-form.component"
import { ClinicListComponent } from "./components/admin/clinic-list/clinic-list.component"
import { UpdateMedicalClinicComponent } from "./components/admin/update-medical-clinic/update-medical-clinic.component"


const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "doctors", component: DoctorListComponent },
  { path: "doctors/:id", component: DoctorDetailComponent },
  { path: "services", component: ServiceListComponent },
  //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   {path: "add-service", component: AddServiceComponent },
   {path: "medical-clinic-form",component: MedicalClinicFormComponent},
   {path: "clinic-list", component: ClinicListComponent},
   {path: "update-clinic/:id", component: UpdateMedicalClinicComponent},
  //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  {
    path: "appointment",
    component: AppointmentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "dashboard",
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "appointments", pathMatch: "full" },
      { path: "profile", component: ProfileEditComponent },
      { path: "appointments", component: AppointmentHistoryComponent },
    ],
  },
  { path: "**", redirectTo: "" },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
