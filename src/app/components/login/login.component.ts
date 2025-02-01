import { Component, inject } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';  // Import HttpClient and HttpClientModule
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';  // Import CommonModule for ngIf, ngClass
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,  // Import HttpClientModule here
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = inject(FormBuilder).group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  responseMessage: string = '';
  responseSuccess: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  // Submit form data to the API
  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      const apiUrl = 'http://localhost:8080/api/users/login'; // Replace with your API URL
      console.log(loginData);

      this.http.post(apiUrl, loginData).subscribe(
        (response: any) => {
          this.responseMessage = 'Login successful!';
          this.responseSuccess = true;
      
          // Redirect to home page after success
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error(error);
          this.responseMessage = 'Login failed. Please check your credentials.' + error;
          this.responseSuccess = false;
        }
      );
    } else {
      this.responseMessage = 'Please fill in all required fields.';
    }
  }

  // Navigate to Signup Page
  onSignup() {
    this.router.navigate(['/signup']);  // Redirects to the Signup page
  }
}
