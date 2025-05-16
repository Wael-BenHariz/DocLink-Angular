import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import { BehaviorSubject,  Observable, of, throwError } from "rxjs"
import { tap } from "rxjs/operators"
import {   User, UserRole } from "../models/user.model"

interface AuthResponse {
  user: User
  token: string
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()
  private readonly TOKEN_KEY = "auth_token"
  private readonly USER_KEY = "current_user"

  // Mock users for development
  private mockUsers: User[] = [
    {
      id: 1,
      username: "patient1",
      role: UserRole.Patient,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phoneNumber: "123-456-7890",
      profilePhotoUrl: "assets/images/patient1.jpg",
      isProfileComplete: true,
    },
    {
      id: 2,
      username: "doctor1",
      role: UserRole.Doctor,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      phoneNumber: "123-456-7891",
      speciality: "Cardiology",
      description: "Experienced cardiologist with 10+ years of practice",
      diploma: "MD, Harvard Medical School",
      profilePhotoUrl: "assets/images/doctor1.jpg",
      isProfileComplete: true,
      clinicId: 1,
    },
  ]

  constructor(private http: HttpClient) {
    this.loadUserFromStorage()
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem(this.USER_KEY)
    if (userJson) {
      try {
        const user = JSON.parse(userJson)
        this.currentUserSubject.next(user)
      } catch (e) {
        localStorage.removeItem(this.USER_KEY)
        localStorage.removeItem(this.TOKEN_KEY)
      }
    }
  }

  register(userData: any): Observable<AuthResponse> {
    // In a real app, this would be an HTTP request
    // return this.http.post<AuthResponse>('/api/auth/register', userData);

    // Mock implementation
    return of({
      user: {
        ...userData,
        id: this.mockUsers.length + 1,
        role: UserRole.Patient,
        isProfileComplete: false,
      },
      token: "mock_token_" + Math.random().toString(36).substr(2),
    }).pipe(tap((response) => this.handleAuthentication(response)))
  }

  login(username: string, password: string): Observable<AuthResponse> {
    // In a real app, this would be an HTTP request
    // return this.http.post<AuthResponse>('/api/auth/login', { username, password });

    // Mock implementation
    const user = this.mockUsers.find((u) => u.username === username)

    if (user) {
      return of({
        user,
        token: "mock_token_" + Math.random().toString(36).substr(2),
      }).pipe(tap((response) => this.handleAuthentication(response)))
    } else {
      return throwError(() => new Error("Invalid username or password"))
    }
  }

  private handleAuthentication(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token)
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user))
    this.currentUserSubject.next(response.user)
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    this.currentUserSubject.next(null)
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value
  }

  isDoctor(): boolean {
    const user = this.getCurrentUser()
    return user?.role === UserRole.Doctor
  }

  isPatient(): boolean {
    const user = this.getCurrentUser()
    return user?.role === UserRole.Patient
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser()
    return user?.role === UserRole.Admin
  }

  updateUserProfile(userData: Partial<User>): Observable<User> {
    // In a real app, this would be an HTTP request
    // return this.http.put<User>('/api/users/profile', userData);

    // Mock implementation
    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      return throwError(() => new Error("Not authenticated"))
    }

    const updatedUser = { ...currentUser, ...userData, isProfileComplete: true }

    // Update in mock users array
    const index = this.mockUsers.findIndex((u) => u.id === currentUser.id)
    if (index !== -1) {
      this.mockUsers[index] = updatedUser
    }

    // Update in local storage and behavior subject
    localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser))
    this.currentUserSubject.next(updatedUser)

    return of(updatedUser)
  }
}
