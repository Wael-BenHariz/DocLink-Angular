import { Component } from "@angular/core"
import  { Router } from "@angular/router"
import  { AuthService } from "../../../services/auth.service"
import  { User } from "../../../models/user.model"

@Component({
  selector: "app-user-dashboard",
  templateUrl: "./user-dashboard.component.html",
  styleUrls: ["./user-dashboard.component.scss"],
  standalone:false
})
export class UserDashboardComponent {
  currentUser: User | null = null

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.currentUser = this.authService.getCurrentUser()

    // Redirect if not logged in
    if (!this.currentUser) {
      this.router.navigate(["/login"])
    }
  }

  get isDoctor(): boolean {
    return this.authService.isDoctor()
  }

  get isPatient(): boolean {
    return this.authService.isPatient()
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/"])
  }
}
