import { Component,  OnInit } from "@angular/core"
import {  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import  { ActivatedRoute, Router } from "@angular/router"
import  { DoctorService } from "../../../services/doctor.service"
import  { ServiceService } from "../../../services/service.service"
import  { AppointmentService } from "../../../services/appointment.service"
import  { AuthService } from "../../../services/auth.service"
import  { User } from "../../../models/user.model"
import  { HealthcareService } from "../../../models/healthcare-service.model"
import  { AppointmentTimeSlot } from "../../../models/appointment-time-slot.model"
import { AppointmentStatus } from "../../../models/appointment.model"

@Component({
  selector: "app-appointment",
  templateUrl: "./appointment.component.html",
  styleUrls: ["./appointment.component.scss"],
  standalone:false
})
export class AppointmentComponent implements OnInit {
  appointmentForm!: FormGroup
  doctors: User[] = []
  services: HealthcareService[] = []
  filteredServices: HealthcareService[] = []
  timeSlots: AppointmentTimeSlot[] = []
  availableTimeSlots: AppointmentTimeSlot[] = []

  isLoading = true
  isSubmitting = false
  errorMessage = ""
  successMessage = ""

  minDate = new Date()

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private serviceService: ServiceService,
    private appointmentService: AppointmentService,
    private authService: AuthService,
  ) {
    // Set min date to tomorrow
    this.minDate.setDate(this.minDate.getDate() + 1)
  }

  ngOnInit(): void {
    this.initForm()
    this.loadDoctors()
    this.loadServices()
    this.loadTimeSlots()

    // Check for query params (doctor and service selection)
    this.route.queryParams.subscribe((params) => {
      const doctorId = params["doctorId"]
      const serviceId = params["serviceId"]

      if (doctorId) {
        this.appointmentForm.get("doctorId")?.setValue(+doctorId)
        this.onDoctorChange()
      }

      if (serviceId) {
        this.appointmentForm.get("serviceId")?.setValue(+serviceId)
      }
    })
  }

  initForm(): void {
    this.appointmentForm = this.formBuilder.group({
      doctorId: ["", [Validators.required]],
      serviceId: ["", [Validators.required]],
      date: ["", [Validators.required]],
      timeSlotId: ["", [Validators.required]],
      description: ["", [Validators.required, Validators.maxLength(1000)]],
    })
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors
        this.isLoading = false
      },
      error: () => {
        this.isLoading = false
        this.errorMessage = "Failed to load doctors. Please try again."
      },
    })
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe({
      next: (services) => {
        this.services = services
        this.filteredServices = services

        // If doctor is already selected, filter services
        const doctorId = this.appointmentForm.get("doctorId")?.value
        if (doctorId) {
          this.filterServicesByDoctor(doctorId)
        }
      },
    })
  }

  loadTimeSlots(): void {
    this.appointmentService.getTimeSlots().subscribe({
      next: (timeSlots) => {
        this.timeSlots = timeSlots
      },
    })
  }

  onDoctorChange(): void {
    const doctorId = this.appointmentForm.get("doctorId")?.value

    if (doctorId) {
      this.filterServicesByDoctor(doctorId)

      // Reset service, date and time slot selections
      this.appointmentForm.get("serviceId")?.setValue("")
      this.appointmentForm.get("date")?.setValue("")
      this.appointmentForm.get("timeSlotId")?.setValue("")
      this.availableTimeSlots = []
    } else {
      this.filteredServices = this.services
    }
  }

  filterServicesByDoctor(doctorId: number): void {
    this.filteredServices = this.services.filter((service) => service.doctorId === doctorId)
  }

  onDateChange(): void {
    const doctorId = this.appointmentForm.get("doctorId")?.value
    const dateStr = this.appointmentForm.get("date")?.value

    if (doctorId && dateStr) {
      const date = new Date(dateStr)

      this.appointmentService.getAvailableTimeSlots(doctorId, date).subscribe({
        next: (timeSlots) => {
          this.availableTimeSlots = timeSlots

          // Reset time slot selection
          this.appointmentForm.get("timeSlotId")?.setValue("")
        },
      })
    }
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      return
    }

    this.isSubmitting = true
    this.errorMessage = ""
    this.successMessage = ""

    const formData = this.appointmentForm.value
    const currentUser = this.authService.getCurrentUser()

    if (!currentUser) {
      this.errorMessage = "You must be logged in to book an appointment."
      this.isSubmitting = false
      return
    }

    // Create appointment date from selected date and time slot
    const appointmentDate = new Date(formData.date)
    const selectedTimeSlot = this.timeSlots.find((ts) => ts.id === formData.timeSlotId)

    if (selectedTimeSlot) {
      const [hours, minutes] = selectedTimeSlot.time.split(":").map(Number)
      appointmentDate.setHours(hours, minutes)
    }

    const appointmentData = {
      date: appointmentDate,
      patientId: currentUser.id,
      doctorId: formData.doctorId,
      status: AppointmentStatus.Pending,
      description: formData.description,
    }

    this.appointmentService.createAppointment(appointmentData).subscribe({
      next: () => {
        this.successMessage = "Appointment booked successfully!"
        this.isSubmitting = false

        // Reset form
        this.appointmentForm.reset()

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          this.router.navigate(["/dashboard/appointments"])
        }, 2000)
      },
      error: (error) => {
        this.errorMessage = error.message || "Failed to book appointment. Please try again."
        this.isSubmitting = false
      },
    })
  }
}
