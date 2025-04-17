import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-job-scheduling',
  templateUrl: './job-scheduling.component.html',
  styleUrls: ['./job-scheduling.component.css'],
  imports: [FormsModule, CommonModule, HeaderComponent],
})
export class JobSchedulingComponent {

  username = '';
  scheduledTime: string = '';
  scheduledJobs: any[] = []; // Array to store scheduled jobs

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const username = sessionStorage.getItem('username') || '';
    this.http.get(`${environment.apiBaseUrl}/api/jobs/jobs`, {
      params: { userName: username }
    })
    .subscribe((value) => {
        console.log('Fetched jobs:', value); // Check the structure of the response
        if (Array.isArray(value)) {
          this.scheduledJobs = value;  // Assign directly if it's an array
        } else {
          console.error('Response is not an array:', value);
        }
      },
      (error) => {
        console.error('Error fetching jobs:', error);
      }
    );
  }

  submitSchedule() {
    if (!this.scheduledTime) {
      alert('Please select a scheduled time.');
      return;
    }
    this.http.post<any>(`${environment.apiBaseUrl}/api/jobs/schedule`, {
      userName: sessionStorage.getItem('username'),
      scheduledTime: this.scheduledTime,
    }).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.scheduledJobs = response;
          window.location.reload(); // Reload the page to fetch updated jobs
          alert('Scheduled successfully!');
        } else if (response?.message && Array.isArray(response?.userJobs)) {
          this.scheduledJobs = response.userJobs;
          alert(response.message);
        } else {
          alert('Unexpected response from server.');
          this.scheduledJobs = [];
        }
      },
      error: (err) => {
        console.error('Scheduling failed', err);
        alert('Scheduling failed: ' + (err.error?.message || err.message));
      }
    });
  }

  // Delete job method
  deleteJob(job: any) {
    const confirmDelete = confirm(`Are you sure you want to delete the job scheduled for ${job.scheduledTime}?`);
  
    if (confirmDelete) {
      this.http.delete(`${environment.apiBaseUrl}/api/jobs/delete/${job.id}`, { responseType: 'text' }).subscribe({
        next: (response) => {
          console.log('Delete response:', response); // You should see "Job deleted successfully."
          this.scheduledJobs = this.scheduledJobs.filter(j => j.id !== job.id); // Remove from UI
          alert(response); // Show the success message
        },
        error: (err) => {
          console.error('Error deleting job:', err);
          alert('Failed to delete the job.');
        }
      });
    }
  }
  
}
