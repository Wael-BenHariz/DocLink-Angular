import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


interface HealthcareService {
  id?: number;
  doctorId?: number;
  doctor?: any;
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
  price?: number;
  durationMinutes: number;
}

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

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      category: ['', Validators.required],
      price: [null, [Validators.min(0)]],
      durationMinutes: [30, [Validators.required, Validators.min(5), Validators.max(240)]]
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
    if (this.serviceForm.invalid) {
      this.markFormGroupTouched(this.serviceForm);
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    const serviceData: HealthcareService = this.serviceForm.value;
    
    // Append form fields
    formData.append('name', serviceData.name);
    formData.append('description', serviceData.description);
    formData.append('category', serviceData.category);
    if (serviceData.price) {
      formData.append('price', serviceData.price.toString());
    }
    formData.append('durationMinutes', serviceData.durationMinutes.toString());
    
    // Append file if selected
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.http.post(``, formData)
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.resetForm();
          setTimeout(() => this.submitSuccess = false, 3000);
        },
        error: (err) => {
          console.error('Error adding service:', err);
          this.isSubmitting = false;
          this.fileError = 'Failed to upload image';
        }
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