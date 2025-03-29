import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ScheduledJob, ScheduledJobService } from '../../services/scheduled-job.service';

@Component({
  selector: 'app-schedule-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule-jobs.component.html',
  styleUrls: ['./schedule-jobs.component.css']
})
export class ScheduleJobsComponent implements OnInit {
  jobs: ScheduledJob[] = [];
  // Initialize newJob with userId = 0; we'll update it after fetching the user record using the username.
  newJob: ScheduledJob = {
    jobName: '',
    vendor: '',
    productName: '',
    version: '',
    keywords: '',
    userId: 0
  };

  constructor(
    private jobService: ScheduledJobService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userIdString = sessionStorage.getItem('userId');
    if (userIdString) {
      const userId = parseInt(userIdString, 10);
      this.newJob.userId = userId;
      this.loadJobs();
    } else {
      console.error('No userId found in sessionStorage');
    }
  }

  loadJobs(): void {
    this.jobService.getJobsByUser(this.newJob.userId).subscribe(
      (data: ScheduledJob[]) => {
        // Only display jobs that are not cancelled.
        this.jobs = data.filter(job => job.status !== 'CANCELLED');
      },
      (error: any) => console.error('Error loading jobs', error)
    );
  }

  createJob(): void {
    const userIdString = sessionStorage.getItem('userId');
    if (userIdString) {
      const userId = parseInt(userIdString, 10);
      this.newJob.userId = userId;
      this.jobService.createJob(this.newJob).subscribe(
        (job: ScheduledJob) => {
          if (job.status !== 'CANCELLED') {
            this.jobs.push(job);
          }
          // Reset newJob while preserving the user id.
          this.newJob = {
            jobName: '',
            vendor: '',
            productName: '',
            version: '',
            keywords: '',
            userId: userId
          };
        },
        (error: any) => console.error('Error creating job', error)
      );
    } else {
      console.error('No userId found in sessionStorage');
    }
  }

  cancelJob(jobId: number): void {
    this.jobService.cancelJob(jobId).subscribe(
      () => {
        this.jobs = this.jobs.filter(job => job.id !== jobId);
      },
      (error: any) => console.error('Error canceling job', error)
    );
  }
}
