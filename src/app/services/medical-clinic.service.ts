import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicalClinic } from '../models/medical-clinic.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MedicalClinicService {
  private apiUrl = 'http://localhost:5190/api/MedicalClinic';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  }

  getClinics(): Observable<MedicalClinic[]> {
    return this.http.get<MedicalClinic[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getClinicById(id: number): Observable<MedicalClinic> {
    return this.http.get<MedicalClinic>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

   getMedicalClinics(): Observable<MedicalClinic[]> {
    return this.http.get<MedicalClinic[]>(`${this.apiUrl}`, {
      headers: this.getHeaders(),
    });
  }
  updateClinic(id: number, clinic: MedicalClinic): Observable<MedicalClinic> {
    return this.http.put<MedicalClinic>(`${this.apiUrl}/${id}`, clinic, {
      headers: this.getHeaders(),
    });
  }

  deleteClinic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createMedicalClinic(clinic: MedicalClinic): Observable<MedicalClinic> {
    return this.http.post<MedicalClinic>(this.apiUrl, clinic, {
      headers: this.getHeaders(),
    });
  }


  update(clinic: MedicalClinic): Observable<any> {
    return this.http.put(`${this.apiUrl}/${clinic.id}`, clinic, {
      headers: this.getHeaders(),
    });
  }
}