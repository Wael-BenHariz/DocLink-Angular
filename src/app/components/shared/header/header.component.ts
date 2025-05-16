import { Component,  OnInit } from "@angular/core"
import  { Router } from "@angular/router"
import  { AuthService } from "../../../services/auth.service"
import  { User } from "../../../models/user.model"

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  standalone:false
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null
  isMenuOpen = false

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user
    })
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/"])
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated()
  }

  get isDoctor(): boolean {
    return this.authService.isDoctor()
  }

  get isPatient(): boolean {
    return this.authService.isPatient()
  }
}
