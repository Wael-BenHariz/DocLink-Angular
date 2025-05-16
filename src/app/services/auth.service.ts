import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, UserRole } from '../models/user.model';

interface AuthResponse {
  user: User;
  token: string;
}

const apiUrl = 'http://localhost:5190/api/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (e) {
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.TOKEN_KEY);
      }
    }
  }

  registerPatient(patientData: {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    profilePhotoUrl?: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(apiUrl+'/register/patient', patientData).pipe(
      tap((response) => this.handleAuthentication(response))
    );
  }

  registerDoctor(doctorData: {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    speciality: string;
    description: string;
    diploma: string;
    profilePhotoUrl?: string;
    clinicId?: number;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(apiUrl+'/register/doctor', doctorData).pipe(
      tap((response) => this.handleAuthentication(response))
    );
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', { username, password }).pipe(
      tap((response) => this.handleAuthentication(response))
    );
  }

  private handleAuthentication(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isDoctor(): boolean {
    const user = this.getCurrentUser();
    return user?.role === UserRole.Doctor;
  }

  isPatient(): boolean {
    const user = this.getCurrentUser();
    return user?.role === UserRole.Patient;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === UserRole.Admin;
  }

  updateUserProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>('/api/users/profile', userData).pipe(
      tap(updatedUser => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
      })
    );
  }
}