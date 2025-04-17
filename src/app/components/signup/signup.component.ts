import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment'; // Adjust the path as necessary

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  private passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword ? { passwordMismatch: true } : null;
  };

  signupForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.minLength(3)]],
    lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9]+$')]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
    organization: ['']
  }, { validators: this.passwordMatchValidator });

  responseMessage: string = '';

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!(control?.hasError(errorName) && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.responseMessage = 'Please fill all required fields correctly.';
      return;
    }

    const formData = this.signupForm.value;
    const apiUrl = `${environment.apiBaseUrl}/api/users/signup`;

    this.http.post(apiUrl, formData).subscribe(
      () => {
        this.responseMessage = 'Signup successful!';
        this.router.navigate(['/login']);
      },
      () => {
        this.responseMessage = 'Signup failed. Please try again.';
      }
    );
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }
}
