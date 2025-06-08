import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable, of } from "rxjs"
import { Appointment, AppointmentStatus } from "../models/appointment.model"
import { AuthService } from "./auth.service"

@Injectable({
  providedIn: "root",
})
export class AppointmentService {

  private apiUrl = 'http://localhost:5190/api/appointment';
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  getAppointments(id:number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
  getPatientAppointments(id:number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/patient/${id}`, { headers: this.getHeaders() });
  }
  getDoctorAppointments(id:number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/doctor/${id}`, { headers: this.getHeaders() });
  }

  getAppointmentById(id: number): Observable<Appointment | undefined> {
   return this.http.get<Appointment>(`${this.apiUrl}/GetById/${id}`, { headers: this.getHeaders() });
  }

  createAppointment(appointmentData: Omit<Appointment, "id">): Observable<Appointment> {
    console.log("appointmentData in service:::::", appointmentData);
    console.log("tokennnnnnnnnn in service:::::", this.authService.getToken());
     return this.http.post<Appointment>(`${this.apiUrl}`, appointmentData, { headers: this.getHeaders() });
  }

  updateAppointmentStatus(id: number, status: AppointmentStatus): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.apiUrl}/Update/${id}`, { status }, { headers: this.getHeaders() });
    }

}
