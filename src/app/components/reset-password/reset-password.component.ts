import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { HttpClientModule, HttpClient } from '@angular/common/http'; // Import HttpClient
import { Router } from '@angular/router'; // Import Router
import { LoadingService } from '../../services/loading.service';
import { environment } from '../../../environments/environment'; // Import environment configuration

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule] // Include HttpClientModule
})
export class ResetPasswordComponent {
  resetData = {
    username: '',
    newPassword: '',
    confirmPassword: ''
  };

  passwordError: string = '';
  confirmError: string = '';
  isSubmitDisabled: boolean = true;
  resetSuccess: boolean = false;
  resetFailed: boolean = false;
  errorMessage: string = '';

  // Inject HttpClient into the component
  private http = inject(HttpClient);
  private router = inject(Router); // Optional: Inject Router if you want to navigate after resetting
  constructor(private loadingService:LoadingService) {}

  // Validate new password
  validatePassword() {
    const password = this.resetData.newPassword;
    this.passwordError = '';

    if (password.length < 8) {
      this.passwordError = 'Password must be at least 8 characters long.';
    } else if (!/[A-Z]/.test(password)) {
      this.passwordError = 'Password must contain at least one uppercase letter.';
    } else if (!/[0-9]/.test(password)) {
      this.passwordError = 'Password must contain at least one number.';
    }

    this.checkFormValidity();
  }

  // Check if passwords match
  checkMatch() {
    this.confirmError = '';

    if (this.resetData.confirmPassword !== this.resetData.newPassword) {
      this.confirmError = 'Passwords do not match.';
    }

    this.checkFormValidity();
  }

  // Check if the form is valid
  checkFormValidity() {
    this.isSubmitDisabled =
      !this.resetData.username || // Ensure username is entered
      !this.resetData.newPassword ||
      !this.resetData.confirmPassword ||
      !!this.passwordError || // Ensure no password validation errors
      !!this.confirmError; // Ensure no mismatch error
  }

  // Handle form submission (e.g., API call to reset password)
  sendResetRequest() {
    this.loadingService.startLoading();
    if (this.isSubmitDisabled) return;
    console.log("submitting");
    const apiUrl = `${environment.apiBaseUrl}/api/users/reset-password`; // Your backend API URL

    // Send the reset password request to the backend
    this.http.put(apiUrl, {
      username: this.resetData.username,
      newPassword: this.resetData.newPassword,
      confirmPassword: this.resetData.confirmPassword
    }, { responseType: 'text' })  // Force response as text
    .subscribe(
      (response) => {
        this.loadingService.stopLoading();
        console.log("Response received:", response);
        alert("Success: " + response);
        this.resetSuccess = true;
        this.resetFailed = false;
        this.errorMessage = '';
        this.router.navigate(['/login']);
      },
      (error) => {
        this.loadingService.stopLoading();
        alert(error);
        // Handle error response
        this.resetSuccess = false;
        this.resetFailed = true;

        // Adjust this to get the correct error message
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message; // Use the backend message if available
        } else {
          this.errorMessage = 'Error resetting password'; // Fallback error message
        }
      }
    );
  }
}
