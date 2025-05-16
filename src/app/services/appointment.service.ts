import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable, of } from "rxjs"
import { Appointment, AppointmentStatus } from "../models/appointment.model"
import { AppointmentTimeSlot } from "../models/appointment-time-slot.model"
import { AuthService } from "./auth.service"

@Injectable({
  providedIn: "root",
})
export class AppointmentService {
  // Mock data for development
  private mockAppointments: Appointment[] = [
    {
      id: 1,
      date: new Date("2023-05-15T10:00:00"),
      patientId: 1,
      doctorId: 2,
      status: AppointmentStatus.Completed,
      description: "Regular heart checkup",
    },
    {
      id: 2,
      date: new Date("2023-06-20T14:30:00"),
      patientId: 1,
      doctorId: 3,
      status: AppointmentStatus.Completed,
      description: "Skin rash examination",
    },
    {
      id: 3,
      date: new Date("2023-07-10T09:15:00"),
      patientId: 1,
      doctorId: 2,
      status: AppointmentStatus.Cancelled,
      description: "Follow-up appointment",
    },
    {
      id: 4,
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      patientId: 1,
      doctorId: 4,
      status: AppointmentStatus.Confirmed,
      description: "Annual checkup",
    },
    {
      id: 5,
      date: new Date(new Date().setDate(new Date().getDate() + 10)),
      patientId: 1,
      doctorId: 5,
      status: AppointmentStatus.Pending,
      description: "Knee pain consultation",
    },
  ]

  private mockTimeSlots: AppointmentTimeSlot[] = [
    { id: 1, time: "09:00", display: "9:00 AM" },
    { id: 2, time: "09:30", display: "9:30 AM" },
    { id: 3, time: "10:00", display: "10:00 AM" },
    { id: 4, time: "10:30", display: "10:30 AM" },
    { id: 5, time: "11:00", display: "11:00 AM" },
    { id: 6, time: "11:30", display: "11:30 AM" },
    { id: 7, time: "13:00", display: "1:00 PM" },
    { id: 8, time: "13:30", display: "1:30 PM" },
    { id: 9, time: "14:00", display: "2:00 PM" },
    { id: 10, time: "14:30", display: "2:30 PM" },
    { id: 11, time: "15:00", display: "3:00 PM" },
    { id: 12, time: "15:30", display: "3:30 PM" },
    { id: 13, time: "16:00", display: "4:00 PM" },
    { id: 14, time: "16:30", display: "4:30 PM" },
  ]

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getAppointments(): Observable<Appointment[]> {
    // In a real app, this would be an HTTP request
    // return this.http.get<Appointment[]>('/api/appointments');

    // Mock implementation
    const currentUser = this.authService.getCurrentUser()
    if (!currentUser) {
      return of([])
    }

    let appointments: Appointment[]

    if (this.authService.isPatient()) {
      appointments = this.mockAppointments.filter((a) => a.patientId === currentUser.id)
    } else if (this.authService.isDoctor()) {
      appointments = this.mockAppointments.filter((a) => a.doctorId === currentUser.id)
    } else {
      appointments = this.mockAppointments // Admin sees all
    }

    return of(appointments)
  }

  getAppointmentById(id: number): Observable<Appointment | undefined> {
    // In a real app, this would be an HTTP request
    // return this.http.get<Appointment>(`/api/appointments/${id}`);

    // Mock implementation
    const appointment = this.mockAppointments.find((a) => a.id === id)
    return of(appointment)
  }

  createAppointment(appointmentData: Omit<Appointment, "id">): Observable<Appointment> {
    // In a real app, this would be an HTTP request
    // return this.http.post<Appointment>('/api/appointments', appointmentData);

    // Mock implementation
    const newAppointment: Appointment = {
      ...appointmentData,
      id: this.mockAppointments.length + 1,
    }

    this.mockAppointments.push(newAppointment)
    return of(newAppointment)
  }

  updateAppointmentStatus(id: number, status: AppointmentStatus): Observable<Appointment> {
    // In a real app, this would be an HTTP request
    // return this.http.patch<Appointment>(`/api/appointments/${id}`, { status });

    // Mock implementation
    const appointmentIndex = this.mockAppointments.findIndex((a) => a.id === id)
    if (appointmentIndex === -1) {
      throw new Error("Appointment not found")
    }

    this.mockAppointments[appointmentIndex] = {
      ...this.mockAppointments[appointmentIndex],
      status,
    }

    return of(this.mockAppointments[appointmentIndex])
  }

  getTimeSlots(): Observable<AppointmentTimeSlot[]> {
    // In a real app, this would be an HTTP request
    // return this.http.get<AppointmentTimeSlot[]>('/api/appointments/time-slots');

    // Mock implementation
    return of(this.mockTimeSlots)
  }

  getAvailableTimeSlots(doctorId: number, date: Date): Observable<AppointmentTimeSlot[]> {
    // In a real app, this would be an HTTP request with query params
    // return this.http.get<AppointmentTimeSlot[]>(`/api/doctors/${doctorId}/available-slots?date=${date.toISOString()}`);

    // Mock implementation - simulate some slots being unavailable
    const bookedAppointments = this.mockAppointments.filter(
      (a) =>
        a.doctorId === doctorId &&
        a.date.toDateString() === date.toDateString() &&
        (a.status === AppointmentStatus.Confirmed || a.status === AppointmentStatus.Pending),
    )

    const bookedTimes = bookedAppointments.map((a) => {
      const hours = a.date.getHours().toString().padStart(2, "0")
      const minutes = a.date.getMinutes().toString().padStart(2, "0")
      return `${hours}:${minutes}`
    })

    const availableSlots = this.mockTimeSlots.filter((slot) => !bookedTimes.includes(slot.time))

    return of(availableSlots)
  }
}
