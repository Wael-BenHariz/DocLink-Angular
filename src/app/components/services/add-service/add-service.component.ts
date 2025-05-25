import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MedicalClinicService } from '@/app/services/medical-clinic.service';




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

  constructor(private fb: FormBuilder, private http: HttpClient,medicalClinicService:MedicalClinicService) {
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