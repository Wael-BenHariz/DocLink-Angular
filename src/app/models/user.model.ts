import type { MedicalClinic } from "./medical-clinic.model"
import type { DoctorAvailability } from "./doctor-availability.model"
import type { DoctorReview } from "./doctor-review.model"
import type { HealthcareService } from "./healthcare-service.model"
import type { Appointment } from "./appointment.model"
import type { PaymentTransaction } from "./payment-transaction.model"

export enum UserRole {
  Patient = "Patient",
  Doctor = "Doctor",
  Admin = "Admin",
}

export interface User {
  id: number
  username: string
  role: UserRole
  firstName?: string
  lastName?: string
  phoneNumber?: string
  email?: string
  speciality?: string
  description?: string
  diploma?: string
  profilePhotoUrl?: string
  isProfileComplete: boolean
  clinicId?: number
  clinic?: MedicalClinic
  availabilities?: DoctorAvailability[]
  reviewsReceived?: DoctorReview[]
  reviewsWritten?: DoctorReview[]
  servicesOffered?: HealthcareService[]
  doctorAppointments?: Appointment[]
  patientAppointments?: Appointment[]
  paymentTransactions?: PaymentTransaction[]
}

export interface DoctorDto {
  username: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  email?: string
  speciality?: string
  description?: string
  diploma?: string
  profilePhotoUrl?: string
  clinicId?: number
}
export interface DoctorDto {
  username: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  email?: string
  profilePhotoUrl?: string
}
