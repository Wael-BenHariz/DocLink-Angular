import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable, of } from "rxjs"
import { HealthcareService } from "../models/healthcare-service.model"

@Injectable({
  providedIn: "root",
})
export class ServiceService {
  // Mock data for development
  private mockServices: HealthcareService[] = [
    {
      id: 1,
      doctorId: 2,
      name: "Cardiac Consultation",
      description: "Comprehensive heart health evaluation",
      category: "Cardiology",
      imageUrl: "assets/images/services/cardiac.jpg",
      price: 150,
      durationMinutes: 45,
    },
    {
      id: 2,
      doctorId: 2,
      name: "ECG Test",
      description: "Electrocardiogram to monitor heart activity",
      category: "Cardiology",
      imageUrl: "assets/images/services/ecg.jpg",
      price: 75,
      durationMinutes: 30,
    },
    {
      id: 3,
      doctorId: 3,
      name: "Skin Examination",
      description: "Full body skin check for abnormalities",
      category: "Dermatology",
      imageUrl: "assets/images/services/skin.jpg",
      price: 120,
      durationMinutes: 40,
    },
    {
      id: 4,
      doctorId: 3,
      name: "Acne Treatment",
      description: "Personalized treatment plan for acne",
      category: "Dermatology",
      imageUrl: "assets/images/services/acne.jpg",
      price: 100,
      durationMinutes: 30,
    },
    {
      id: 5,
      doctorId: 4,
      name: "Pediatric Checkup",
      description: "Regular health checkup for children",
      category: "Pediatrics",
      imageUrl: "assets/images/services/pediatric.jpg",
      price: 90,
      durationMinutes: 30,
    },
    {
      id: 6,
      doctorId: 5,
      name: "Joint Pain Consultation",
      description: "Evaluation and treatment for joint pain",
      category: "Orthopedics",
      imageUrl: "assets/images/services/joint.jpg",
      price: 130,
      durationMinutes: 45,
    },
  ]

  constructor(private http: HttpClient) {}

  getServices(): Observable<HealthcareService[]> {
    // In a real app, this would be an HTTP request
    // return this.http.get<HealthcareService[]>('/api/services');

    // Mock implementation
    return of(this.mockServices)
  }

  getServiceById(id: number): Observable<HealthcareService | undefined> {
    // In a real app, this would be an HTTP request
    // return this.http.get<HealthcareService>(`/api/services/${id}`);

    // Mock implementation
    const service = this.mockServices.find((s) => s.id === id)
    return of(service)
  }

  getServicesByDoctor(doctorId: number): Observable<HealthcareService[]> {
    // In a real app, this would be an HTTP request
    // return this.http.get<HealthcareService[]>(`/api/doctors/${doctorId}/services`);

    // Mock implementation
    const services = this.mockServices.filter((s) => s.doctorId === doctorId)
    return of(services)
  }

  getServicesByCategory(category: string): Observable<HealthcareService[]> {
    // In a real app, this would be an HTTP request with query params
    // return this.http.get<HealthcareService[]>(`/api/services?category=${category}`);

    // Mock implementation
    const services = this.mockServices.filter((s) => s.category.toLowerCase().includes(category.toLowerCase()))
    return of(services)
  }
}
