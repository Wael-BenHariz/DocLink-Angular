import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable, of } from "rxjs"
import { HealthcareService } from "../models/healthcare-service.model"
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class ServiceService {
  private apiUrl = 'http://localhost:5190/api/HealthcareService';



  constructor(private http: HttpClient , private authService: AuthService) {}


  getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getServices(): Observable<HealthcareService[]> {
    return this.http.get<HealthcareService[]>(this.apiUrl, {
      headers: this.getHeaders()
    });

  }


  getServicesByDoctor(doctorId: number): Observable<HealthcareService[]> {
        return this.http.get<HealthcareService[]>(`${this.apiUrl}/doctor/${doctorId}`, {
        headers: this.getHeaders()
      });

  }


}
