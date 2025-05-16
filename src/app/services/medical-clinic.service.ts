import { Injectable } from '@angular/core';
import { MedicalClinic } from '../models/medical-clinic.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalClinicService {


  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:5190/api/MedicalClinic';

  getMedicalClinics(): Observable<MedicalClinic[]> {
    return this.http.get<MedicalClinic[]>(this.apiUrl);
  }

  getMedicalClinicById(id: number): Observable<MedicalClinic> {
    return this.http.get<MedicalClinic>(`${this.apiUrl}/${id}`);
  }
}
