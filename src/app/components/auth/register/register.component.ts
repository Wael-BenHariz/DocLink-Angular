import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../models/user.model';
import { MedicalClinic } from '@/app/models/medical-clinic.model';
import { MedicalClinicService } from '@/app/services/medical-clinic.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false,
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  isPatient = true;
  clinics: MedicalClinic[] = [];
  isLoadingClinics = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private medicalClinicService: MedicalClinicService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadClinics();
  }

  loadClinics(): void {
    this.isLoadingClinics = true;
    this.medicalClinicService.getMedicalClinics().subscribe({
      next: (clinics) => {
        this.clinics = clinics;
        console.log(this.clinics);
        this.isLoadingClinics = false;
      },
      error: (error) => {
        console.error('Failed to load clinics', error);
        this.isLoadingClinics = false;
      },
    });
  }
  initializeForm(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      // Doctor specific fields
      speciality: [''],
      description: [''],
      diploma: [''],
      clinicId: [null]
    }, {
      validators: this.passwordMatchValidator
    });

    this.updateFormValidation();
  }

  setRole(role: 'patient' | 'doctor'): void {
    this.isPatient = role === 'patient';
    this.updateFormValidation();
  }

  updateFormValidation(): void {
    const specialityControl = this.registerForm.get('speciality');
    const descriptionControl = this.registerForm.get('description');
    const diplomaControl = this.registerForm.get('diploma');

    if (this.isPatient) {
      specialityControl?.clearValidators();
      descriptionControl?.clearValidators();
      diplomaControl?.clearValidators();
    } else {
      specialityControl?.setValidators([Validators.required]);
      descriptionControl?.setValidators([Validators.required]);
      diplomaControl?.setValidators([Validators.required]);
    }

    specialityControl?.updateValueAndValidity();
    descriptionControl?.updateValueAndValidity();
    diplomaControl?.updateValueAndValidity();
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formData = { ...this.registerForm.value };
    delete formData.confirmPassword;

    if (this.isPatient) {
      delete formData.speciality;
      delete formData.description;
      delete formData.diploma;
      delete formData.clinicId;

      this.authService.registerPatient(formData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Patient registration failed. Please try again.';
          this.isSubmitting = false;
        },
      });
    } else {
      this.authService.registerDoctor(formData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Doctor registration failed. Please try again.';
          this.isSubmitting = false;
        },
      });
    }
  }
}