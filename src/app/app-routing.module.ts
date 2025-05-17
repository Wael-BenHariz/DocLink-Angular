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


const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "doctors", component: DoctorListComponent },
  { path: "doctors/:id", component: DoctorDetailComponent },
  { path: "services", component: ServiceListComponent },
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
