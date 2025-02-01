import { Component, inject } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http'; // Import HttpClient
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule, // Import HttpClientModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm = inject(FormBuilder).group({
    firstName: [''],
    lastName: [''],
    phone: [''],
    email: [''],
    username: [''],
    password: [''],
    organization: ['']
  });

  responseMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {} // Inject Router

  // Submit form data to the API
  onSubmit() {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;
      const apiUrl = 'http://localhost:8080/api/users/signup'; // Replace with your API URL

      this.http.post(apiUrl, formData).subscribe(
        (response: any) => {
          this.responseMessage = 'Signup successful!';
          this.router.navigate(['/login']); // Redirect to Login page after successful signup
        },
        (error) => {
          console.error(error);
          this.responseMessage = 'Signup failed. Please try again.';
        }
      );
    } else {
      this.responseMessage = 'Please fill all required fields correctly.';
    }
  }

  // Navigate to Login Page
  onLogin() {
    this.router.navigate(['/login']); // Redirects to the Login page
  }
}
