import { Component, inject } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http'; // Import HttpClient
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule, // Import HttpClientModule
    FormsModule, // For two-way binding with ngModel
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  showPopup = false;
  resetSuccess = false;
  resetFailed = false;
  errorMessage = '';

  resetData = {
    username: '',
    dob: '',
    email: '',
  };

  // Inject HttpClient and Router into the component
  private http = inject(HttpClient);
  private router = inject(Router);

  openResetPopup() {
    this.showPopup = true;
  }

  closeResetPopup() {
    this.showPopup = false;
  }
  backToLogin() {
    this.router.navigate(['/login']);
  }

  // Send the reset link to the backend
  sendResetLink() {
    const apiUrl = 'http://localhost:8080/api/users/forgot-password'; // Backend API URL

    // Sending the email to the backend to trigger reset link
    this.http.post(apiUrl, { email: this.resetData.email }).subscribe(
      (response: any) => {
        // Handle successful response
        this.showPopup = false;
        this.resetSuccess = true;
        this.resetFailed = false;
        this.errorMessage = '';  // Clear any previous errors
        alert('Reset link sent successfully');
      },
      (error) => {
        // Handle error response
        this.resetSuccess = false;
        this.resetFailed = true;
        this.errorMessage = error.error || 'Error sending reset link';
      }
    );
    this.router.navigate(['/login']);
  }
}
