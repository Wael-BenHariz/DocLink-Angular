import { Component,  OnInit } from "@angular/core"
import  { DoctorService } from "../../../services/doctor.service"
import  { User } from "../../../models/user.model"

@Component({
  selector: "app-doctor-list",
  templateUrl: "./doctor-list.component.html",
  styleUrls: ["./doctor-list.component.scss"],
  standalone:false
})
export class DoctorListComponent implements OnInit {
  doctors: User[] = []
  filteredDoctors: User[] = []
  isLoading = true
  searchTerm = ""
  selectedSpecialty = ""

  specialties: string[] = []

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDoctors()
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors
        this.filteredDoctors = doctors

        // Extract unique specialties
        const specialtiesSet = new Set<string>()
        doctors.forEach((doctor) => {
          if (doctor.speciality) {
            specialtiesSet.add(doctor.speciality)
          }
        })
        this.specialties = Array.from(specialtiesSet)

        this.isLoading = false
      },
      error: () => {
        this.isLoading = false
      },
    })
  }

  filterDoctors(): void {
    this.filteredDoctors = this.doctors.filter((doctor) => {
      const matchesSearch =
        doctor.firstName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        doctor.lastName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        doctor.speciality?.toLowerCase().includes(this.searchTerm.toLowerCase())

      const matchesSpecialty = !this.selectedSpecialty || doctor.speciality === this.selectedSpecialty

      return matchesSearch && matchesSpecialty
    })
  }

  onSearchChange(): void {
    this.filterDoctors()
  }

  onSpecialtyChange(specialty: string): void {
    this.selectedSpecialty = specialty
    this.filterDoctors()
  }
}
