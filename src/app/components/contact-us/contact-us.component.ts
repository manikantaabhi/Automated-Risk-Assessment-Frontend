import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../services/loading.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-contact-us',
  imports: [FormsModule,HttpClientModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  formData = { name: '', email: '', message: '' };

  constructor(private http: HttpClient,private loadingService:LoadingService,private location:Location) {}

  
  goBack(): void {
    this.location.back();
  }
  
  onSubmit() {
    if (!this.formData.name || !this.formData.email || !this.formData.message) {
      alert('Please fill in all fields.');
      return;
    }
    this.loadingService.startLoading();
    this.http.post(`${environment.apiBaseUrl}/contact/send`, this.formData, { responseType: 'text' })
      .subscribe(
        (response) => {
          this.loadingService.stopLoading();
          console.log(response); // should log: "Email sent successfully"
          alert('Message sent successfully!');
          this.formData = { name: '', email: '', message: '' };
        },
        (error) => {
          this.loadingService.stopLoading();
          console.error('Error:', error);
          alert('Failed to send message.');
        }
      );
  }
  
}
