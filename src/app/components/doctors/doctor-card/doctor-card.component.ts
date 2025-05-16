import { Component, Input } from "@angular/core"
import  { User } from "../../../models/user.model"
import  { Router } from "@angular/router"

@Component({
  selector: "app-doctor-card",
  templateUrl: "./doctor-card.component.html",
  styleUrls: ["./doctor-card.component.scss"],
  standalone:false
})
export class DoctorCardComponent {
  @Input() doctor!: User

  constructor(private router: Router) {}

  viewProfile(): void {
    this.router.navigate(["/doctors", this.doctor.id])
  }

  bookAppointment(): void {
    this.router.navigate(["/appointment"], {
      queryParams: { doctorId: this.doctor.id },
    })
  }
}
