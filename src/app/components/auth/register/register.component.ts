import { Component,  OnInit } from "@angular/core"
import {  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import  { Router } from "@angular/router"
import  { AuthService } from "../../../services/auth.service"

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
  standalone:false
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup
  isSubmitting = false
  errorMessage = ""

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        firstName: ["", [Validators.required]],
        lastName: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        username: ["", [Validators.required, Validators.minLength(4)]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]],
        gender: ["", [Validators.required]],
        dateOfBirth: ["", [Validators.required]],
        phoneNumber: ["", [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    )
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get("password")?.value
    const confirmPassword = form.get("confirmPassword")?.value

    return password === confirmPassword ? null : { passwordMismatch: true }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return
    }

    this.isSubmitting = true
    this.errorMessage = ""

    const formData = { ...this.registerForm.value }
    delete formData.confirmPassword

    this.authService.register(formData).subscribe({
      next: () => {
        this.router.navigate(["/dashboard"])
      },
      error: (error) => {
        this.errorMessage = error.message || "Registration failed. Please try again."
        this.isSubmitting = false
      },
    })
  }
}
