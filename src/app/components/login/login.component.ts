import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9_]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[A-Z].*$/)]],
    });
  }

  validatePassword() {
    const passwordValue = this.loginForm.get('password')?.value || '';
    this.showPasswordError = passwordValue.length < 6 || !/^[A-Z]/.test(passwordValue);
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      const apiUrl = 'http://localhost:8080/api/users/login';

      this.http.post(apiUrl, loginData).subscribe(
        (response: any) => {
          sessionStorage.setItem(this.loginForm.get('username')?.value, response.token);
          sessionStorage.setItem('isLoggedIn', 'true');
          this.responseMessage = 'Login successful!';
          this.responseSuccess = true;
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error(error);
          this.responseMessage = 'Login failed. Please check your credentials.';
          this.responseSuccess = false;
        }
      );
    } else {
      this.responseMessage = 'Please correct the errors in the form.';
    }
  }

  onSignup() {
    this.router.navigate(['/signup']);
  }
}
