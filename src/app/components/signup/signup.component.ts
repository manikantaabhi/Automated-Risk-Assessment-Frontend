import { Component, inject } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';  // Import HttpClient and HttpClientModule
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // Import CommonModule for ngIf, ngClass

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,  // Import HttpClientModule here
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

  constructor(private http: HttpClient) {}

  // Submit form data to the API
  onSubmit() {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;
      console.log(formData);
      const apiUrl = 'http://localhost:8080/api/users/signup'; // Replace with your API URL
      console.log(formData);
      this.http.post(apiUrl, formData).subscribe(
        (response: any) => {
          this.responseMessage = 'Signup successful!';
        },
        (error) => {
          console.log(error);
          this.responseMessage = 'Signup failed. Please try again.';
        }
      );
    } else {
      this.responseMessage = 'Please fill all required fields correctly.';
    }
  }
}
