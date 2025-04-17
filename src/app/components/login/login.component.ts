import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  responseMessage: string = '';
  responseSuccess: boolean = false;
  showPasswordError: boolean = false;
  passwordFieldType: string = 'password';

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private loadingService: LoadingService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9_]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[A-Z].*$/)]],
    });
  }

  // Validate password format
  validatePassword(): void {
    const passwordValue = this.loginForm.get('password')?.value || '';
    this.showPasswordError = passwordValue.length < 6 || !/^[A-Z]/.test(passwordValue);
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  // Handle form submission for login
  onSubmit(): void {
    this.loadingService.startLoading();

    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      const apiUrl = `${environment.apiBaseUrl}/api/users/login`;

      this.http.post(apiUrl, loginData).subscribe(
        (response: any) => {
          this.handleOtpPopup(response);
        },
        (error) => {
          this.loadingService.stopLoading();
          this.handleLoginError(error);
        }
      );
    } else {
      this.responseMessage = 'Please correct the errors in the form.';
    }
  }

  // Handle OTP popup creation and logic
  private handleOtpPopup(response: any): void {
    const otpPopup = this.createOtpPopup();

    document.body.appendChild(otpPopup);

    const submitButton = otpPopup.querySelector('button');
    submitButton?.addEventListener('click', () => this.handleOtpSubmit(response, otpPopup));
  }

  // Create OTP popup element
  private createOtpPopup(): HTMLElement {
    const otpPopup = document.createElement('div');
    otpPopup.style.position = 'fixed';
    otpPopup.style.top = '50%';
    otpPopup.style.left = '50%';
    otpPopup.style.transform = 'translate(-50%, -50%)';
    otpPopup.style.backgroundColor = 'white';
    otpPopup.style.padding = '20px';
    otpPopup.style.borderRadius = '8px';
    otpPopup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    otpPopup.style.zIndex = '10001';

    const otpInput = document.createElement('input');
    otpInput.type = 'text';
    otpInput.placeholder = 'Enter OTP';
    otpInput.style.padding = '8px';
    otpInput.style.marginBottom = '10px';
    otpInput.style.width = '200px';
    otpInput.style.display = 'block';

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.style.padding = '8px 16px';
    submitButton.style.backgroundColor = '#4CAF50';
    submitButton.style.color = 'white';
    submitButton.style.border = 'none';
    submitButton.style.borderRadius = '4px';
    submitButton.style.cursor = 'pointer';

    otpPopup.appendChild(otpInput);
    otpPopup.appendChild(submitButton);

    return otpPopup;
  }

  // Handle OTP submission
  private handleOtpSubmit(response: any, otpPopup: HTMLElement): void {
    const otpInput = otpPopup.querySelector('input');
    const otp = (otpInput as HTMLInputElement).value;
    const twoFactorUrl = `${environment.apiBaseUrl}/api/users/2fa/verify`;

    this.http.post(twoFactorUrl, {
      username: this.loginForm.get('username')?.value,
      otp: otp,
    }).subscribe(
      (twoFactorResponse: any) => {
        this.loadingService.stopLoading();
        document.body.removeChild(otpPopup);
        
        if (twoFactorResponse.success) {
          this.handleSuccessfulLogin(response);
        } else {
          this.handleOtpError();
        }
      },
      (error) => {
        this.loadingService.stopLoading();
        document.body.removeChild(otpPopup);
        this.responseMessage = 'OTP verification failed. Please try again.';
        this.responseSuccess = false;
      }
    );
  }

  // Handle successful login
  private handleSuccessfulLogin(response: any): void {
    sessionStorage.setItem(this.loginForm.get('username')?.value, response.token);
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('username', this.loginForm.get('username')?.value);
    this.responseMessage = 'Login successful!';
    this.responseSuccess = true;
    this.router.navigate(['/home']);
  }

  // Handle login error
  private handleLoginError(error: any): void {
    console.error(error);
    this.responseMessage = 'Login failed. Please check your credentials.';
    this.responseSuccess = false;
  }

  // Handle OTP error
  private handleOtpError(): void {
    this.responseMessage = 'Invalid OTP. Please try again.';
    this.responseSuccess = false;
  }

  // Navigate to sign-up page
  onSignup(): void {
    this.router.navigate(['/signup']);
  }
}
