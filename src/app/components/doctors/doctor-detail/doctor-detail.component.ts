import { Component,  OnInit } from "@angular/core"
import  { ActivatedRoute, Router } from "@angular/router"
import  { DoctorService } from "../../../services/doctor.service"
import  { ServiceService } from "../../../services/service.service"
import  { User } from "../../../models/user.model"
import  { DoctorReview } from "../../../models/doctor-review.model"
import  { HealthcareService } from "../../../models/healthcare-service.model"
import  { DoctorAvailability } from "../../../models/doctor-availability.model"

@Component({
  selector: "app-doctor-detail",
  templateUrl: "./doctor-detail.component.html",
  styleUrls: ["./doctor-detail.component.scss"],
  standalone:false
})
export class DoctorDetailComponent implements OnInit {
  doctorId!: number
  doctor: User | undefined
  reviews: DoctorReview[] = []
  services: HealthcareService[] = []
  availability: DoctorAvailability[] = []
  isLoading = true

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private serviceService: ServiceService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.doctorId = +params["id"]
      this.loadDoctorDetails()
    })
  }

  loadDoctorDetails(): void {
    this.isLoading = true

    // Load doctor profile
    this.doctorService.getDoctorById(this.doctorId).subscribe({
      next: (doctor) => {
        this.doctor = doctor
        this.isLoading = false

        // Load reviews, services, and availability
        this.loadReviews()
        this.loadServices()
        this.loadAvailability()
      },
      error: () => {
        this.isLoading = false
        // Handle error, maybe redirect to 404
        this.router.navigate(["/doctors"])
      },
    })
  }

  loadReviews(): void {
    this.doctorService.getDoctorReviews(this.doctorId).subscribe({
      next: (reviews) => {
        this.reviews = reviews
      },
    })
  }

  loadServices(): void {
    this.serviceService.getServicesByDoctor(this.doctorId).subscribe({
      next: (services) => {
        this.services = services
      },
    })
  }

  loadAvailability(): void {
    this.doctorService.getDoctorAvailability(this.doctorId).subscribe({
      next: (availability) => {
        this.availability = availability
      },
    })
  }

  bookAppointment(): void {
    this.router.navigate(["/appointment"], {
      queryParams: { doctorId: this.doctorId },
    })
  }

  getDayName(day: number): string {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[day]
  }

  formatTime(date: Date): string {
    const d = new Date(date)
    let hours = d.getHours()
    const minutes = d.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"

    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'

    const minutesStr = minutes < 10 ? "0" + minutes : minutes

    return `${hours}:${minutesStr} ${ampm}`
  }

 
}
