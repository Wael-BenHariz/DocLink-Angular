import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MedicalClinicService } from '@/app/services/medical-clinic.service';
import { HealthcareService } from '@/app/models/healthcare-service.model';
import { ServiceService } from '@/app/services/service.service';
import { AuthService } from '@/app/services/auth.service';
import { FileUploadService } from '@/app/services/file-upload.service';



@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css'],
  standalone:false
})
export class AddServiceComponent {
  serviceForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  imagePreview: string | null = null;
  fileError: string | null = null;
  selectedFile: File | null = null;
  healthcareService!: HealthcareService;
  PhotoUrl: string ="";

  constructor(private fb: FormBuilder, private authService:AuthService,private service:ServiceService,private fileUploadService:FileUploadService) {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      durationMinutes: [30, [Validators.required, Validators.min(1)]],
      imageUrl: ['']
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        this.fileError = 'Image size must be less than 2MB';
        this.imagePreview = null;
        this.selectedFile = null;
        return;
      }
      if (!file.type.startsWith('image/')) {
        this.fileError = 'Please select an image file';
        this.imagePreview = null;
        this.selectedFile = null;
        return;
      }

      this.fileError = null;
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {

    if (this.selectedFile) {
      this.fileUploadService.uploadProfilePhoto(this.selectedFile).subscribe({
        next: (response) => {
          this.PhotoUrl = response.imageUrl;
          this.isSubmitting = false;
        },
        error: (error) => {
        console.log("error uploading image : ", error);
        this.isSubmitting = false;
      }
    });
    }
    console.log("serviceForm.value:::::", this.serviceForm.value);
    this.healthcareService = this.serviceForm.value;
    this.healthcareService.doctorId = this.authService.getUserId();
    this.healthcareService.imageUrl = this.PhotoUrl;
    this.service.addService(this.healthcareService).subscribe((response) => {
      console.log("response:::::", response);
    },(error)=>{
      console.log("error adding service : ", error);
    });



  }

  resetForm(): void {
    this.serviceForm.reset({
      durationMinutes: 30
    });
    this.imagePreview = null;
    this.selectedFile = null;
    this.fileError = null;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}