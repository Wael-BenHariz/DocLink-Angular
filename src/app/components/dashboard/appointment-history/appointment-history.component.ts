import { Component, OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { AppointmentService } from "../../../services/appointment.service"
import { DoctorService } from "../../../services/doctor.service"
import { AuthService } from "../../../services/auth.service"
import { Appointment, AppointmentStatus } from "../../../models/appointment.model"

@Component({
  selector: "app-appointment-history",
  templateUrl: "./appointment-history.component.html",
  styleUrls: ["./appointment-history.component.scss"],
  standalone:false
})
export class AppointmentHistoryComponent implements OnInit {
  appointments: Appointment[] = []
  filteredAppointments: Appointment[] = []
  isLoading = true
  errorMessage = ""
  statusFilter = "all"

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadAppointments()
  }

  loadAppointments(): void {
    this.isLoading = true

    this.appointmentService.getAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments

        // Load doctor details for each appointment
        this.appointments.forEach((appointment) => {
          this.loadDoctorDetails(appointment)
        })

        this.filterAppointments()
        this.isLoading = false
      },
      error: () => {
        this.errorMessage = "Failed to load appointments. Please try again."
        this.isLoading = false
      },
    })
  }

  loadDoctorDetails(appointment: Appointment): void {
    this.doctorService.getDoctorById(appointment.doctorId).subscribe({
      next: (doctor) => {
        appointment.doctor = doctor
      },
    })
  }

  filterAppointments(): void {
    if (this.statusFilter === "all") {
      this.filteredAppointments = [...this.appointments]
    } else {
      this.filteredAppointments = this.appointments.filter((appointment) => appointment.status === this.statusFilter)
    }

    // Sort by date (newest first)
    this.filteredAppointments.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }

  onStatusFilterChange(status: string): void {
    this.statusFilter = status
    this.filterAppointments()
  }

  cancelAppointment(appointmentId: number): void {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      this.appointmentService.updateAppointmentStatus(appointmentId, AppointmentStatus.Cancelled).subscribe({
        next: () => {
          // Update local appointment status
          const appointment = this.appointments.find((a) => a.id === appointmentId)
          if (appointment) {
            appointment.status = AppointmentStatus.Cancelled
            this.filterAppointments()
          }
        },
        error: () => {
          this.errorMessage = "Failed to cancel appointment. Please try again."
        },
      })
    }
  }

  getStatusClass(status: AppointmentStatus): string {
    switch (status) {
      case AppointmentStatus.Pending:
        return "status-pending"
      case AppointmentStatus.Confirmed:
        return "status-confirmed"
      case AppointmentStatus.Completed:
        return "status-completed"
      case AppointmentStatus.Cancelled:
        return "status-cancelled"
      default:
        return ""
    }
  }

  bookAppointment(): void {
    this.router.navigate(["/appointment"])
  }

  get isDoctor(): boolean {
    return this.authService.isDoctor()
  }

  confirmAppointment(appointmentId: number): void {
    if (this.isDoctor && confirm("Are you sure you want to confirm this appointment?")) {
      this.appointmentService.updateAppointmentStatus(appointmentId, AppointmentStatus.Confirmed).subscribe({
        next: () => {
          // Update local appointment status
          const appointment = this.appointments.find((a) => a.id === appointmentId)
          if (appointment) {
            appointment.status = AppointmentStatus.Confirmed
            this.filterAppointments()
          }
        },
        error: () => {
          this.errorMessage = "Failed to confirm appointment. Please try again."
        },
      })
    }
  }

  completeAppointment(appointmentId: number): void {
    if (this.isDoctor && confirm("Are you sure you want to mark this appointment as completed?")) {
      this.appointmentService.updateAppointmentStatus(appointmentId, AppointmentStatus.Completed).subscribe({
        next: () => {
          // Update local appointment status
          const appointment = this.appointments.find((a) => a.id === appointmentId)
          if (appointment) {
            appointment.status = AppointmentStatus.Completed
            this.filterAppointments()
          }
        },
        error: () => {
          this.errorMessage = "Failed to complete appointment. Please try again."
        },
      })
    }
  }
}
