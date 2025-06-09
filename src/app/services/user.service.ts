import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DoctorProfileDto, User, UserUpdateDto } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:5190/api/user';



  constructor(private http: HttpClient , private authService: AuthService) {}
 getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllUsers():Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }


  getDoctors(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/doctors`, {
      headers: this.getHeaders()
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`,{
      headers: this.getHeaders()
    })
  }

  completeDoctorProfile(profile: DoctorProfileDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${profile.id}/complete-profile`, profile,{
      headers: this.getHeaders()
    })
  }

  update(user: UserUpdateDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${user.id}`, user,{
      headers: this.getHeaders()
    })
  }
}
