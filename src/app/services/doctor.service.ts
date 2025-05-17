import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import {  Observable, of } from "rxjs"
import {  User, UserRole } from "../models/user.model"
import  { DoctorReview } from "../models/doctor-review.model"
import  { DoctorAvailability } from "../models/doctor-availability.model"

@Injectable({
  providedIn: "root",
})
export class DoctorService {
  apiurl ="http://localhost:5190"
  // Mock data for development
  private mockDoctors: User[] = [
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
    {
      id: 3,
      username: "doctor2",
      role: UserRole.Doctor,
      firstName: "Michael",
      lastName: "Johnson",
      email: "michael@example.com",
      phoneNumber: "123-456-7892",
      speciality: "Dermatology",
      description: "Board-certified dermatologist specializing in skin conditions",
      diploma: "MD, Johns Hopkins University",
      profilePhotoUrl: "assets/images/doctor2.jpg",
      isProfileComplete: true,
      clinicId: 2,
    },
    {
      id: 4,
      username: "doctor3",
      role: UserRole.Doctor,
      firstName: "Sarah",
      lastName: "Williams",
      email: "sarah@example.com",
      phoneNumber: "123-456-7893",
      speciality: "Pediatrics",
      description: "Caring pediatrician with a focus on child development",
      diploma: "MD, Stanford University",
      profilePhotoUrl: "assets/images/doctor3.jpg",
      isProfileComplete: true,
      clinicId: 1,
    },
    {
      id: 5,
      username: "doctor4",
      role: UserRole.Doctor,
      firstName: "Robert",
      lastName: "Brown",
      email: "robert@example.com",
      phoneNumber: "123-456-7894",
      speciality: "Orthopedics",
      description: "Orthopedic surgeon specializing in sports injuries",
      diploma: "MD, University of California",
      profilePhotoUrl: "assets/images/doctor4.jpg",
      isProfileComplete: true,
      clinicId: 3,
    },
  ]

  private mockReviews: DoctorReview[] = [
    {
      id: 1,
      patientId: 1,
      doctorId: 2,
      stars: 5,
      comment: "Dr. Smith was very professional and caring. Highly recommend!",
      datePosted: new Date("2023-01-15"),
    },
    {
      id: 2,
      patientId: 6,
      doctorId: 2,
      stars: 4,
      comment: "Good experience overall. Wait time was a bit long.",
      datePosted: new Date("2023-02-20"),
    },
    {
      id: 3,
      patientId: 1,
      doctorId: 3,
      stars: 5,
      comment: "Dr. Johnson helped clear my skin condition. Very knowledgeable!",
      datePosted: new Date("2023-03-10"),
    },
  ]

  private mockAvailabilities: DoctorAvailability[] = [
    {
      id: 1,
      doctorId: 2,
      startTime: new Date("2023-01-01T09:00:00"),
      endTime: new Date("2023-01-01T17:00:00"),
      day: 1, // Monday
    },
    {
      id: 2,
      doctorId: 2,
      startTime: new Date("2023-01-01T09:00:00"),
      endTime: new Date("2023-01-01T17:00:00"),
      day: 3, // Wednesday
    },
    {
      id: 3,
      doctorId: 2,
      startTime: new Date("2023-01-01T09:00:00"),
      endTime: new Date("2023-01-01T17:00:00"),
      day: 5, // Friday
    },
    {
      id: 4,
      doctorId: 3,
      startTime: new Date("2023-01-01T10:00:00"),
      endTime: new Date("2023-01-01T18:00:00"),
      day: 2, // Tuesday
    },
    {
      id: 5,
      doctorId: 3,
      startTime: new Date("2023-01-01T10:00:00"),
      endTime: new Date("2023-01-01T18:00:00"),
      day: 4, // Thursday
    },
  ]

  constructor(private http: HttpClient) {}


  getDoctors(): Observable<User[]> {

    return this.http.get<User[]>(this.apiurl+'/api/doctors');
  }

  getDoctorById(id: number): Observable<User | undefined> {
    return this.http.get<User>(this.apiurl+`/api/doctors/${id}`);

    
  }

  getDoctorReviews(doctorId: number): Observable<DoctorReview[]> {
    // In a real app, this would be an HTTP request
    // return this.http.get<DoctorReview[]>(`/api/doctors/${doctorId}/reviews`);

    // Mock implementation
    const reviews = this.mockReviews.filter((r) => r.doctorId === doctorId)
    return of(reviews)
  }

  getDoctorAvailability(doctorId: number): Observable<DoctorAvailability[]> {
    // In a real app, this would be an HTTP request
    // return this.http.get<DoctorAvailability[]>(`/api/doctors/${doctorId}/availability`);

    // Mock implementation
    const availability = this.mockAvailabilities.filter((a) => a.doctorId === doctorId)
    return of(availability)
  }

  submitReview(review: Omit<DoctorReview, "id" | "datePosted">): Observable<DoctorReview> {
    // In a real app, this would be an HTTP request
    // return this.http.post<DoctorReview>('/api/reviews', review);

    // Mock implementation
    const newReview: DoctorReview = {
      ...review,
      id: this.mockReviews.length + 1,
      datePosted: new Date(),
    }

    this.mockReviews.push(newReview)
    return of(newReview)
  }

  filterDoctorsBySpecialty(specialty: string): Observable<User[]> {
    // In a real app, this would be an HTTP request with query params
    // return this.http.get<User[]>(`/api/doctors?specialty=${specialty}`);

    // Mock implementation
    const filteredDoctors = this.mockDoctors.filter((d) =>
      d.speciality?.toLowerCase().includes(specialty.toLowerCase()),
    )
    return of(filteredDoctors)
  }
}
