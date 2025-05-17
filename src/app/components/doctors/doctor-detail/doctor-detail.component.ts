import { Component,  OnInit } from "@angular/core"
import  { ActivatedRoute, Router } from "@angular/router"
import  { DoctorService } from "../../../services/doctor.service"
import  { User } from "../../../models/user.model"


@Component({
  selector: "app-doctor-detail",
  templateUrl: "./doctor-detail.component.html",
  styleUrls: ["./doctor-detail.component.scss"],
  standalone:false
})
export class DoctorDetailComponent implements OnInit {
  doctorId!: number;
  doctor?: User;
  isLoading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.doctorId = +this.route.snapshot.paramMap.get('id')!;
    this.loadDoctor();
  }

  loadDoctor(): void {
    this.doctorService.getDoctorById(this.doctorId).subscribe({
      next: (doctor) => {
        this.doctor = doctor;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Doctor not found';
        console.error('Error loading doctor:', err);
        this.isLoading = false;
      },
    });
  }

 
}
