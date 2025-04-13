import { Component } from '@angular/core';

@Component({
  selector: 'app-schedule-jobs',
  templateUrl: './schedule-jobs.component.html',
  styleUrls: ['./schedule-jobs.component.css']
})
export class ScheduleJobsComponent {
  jobs = [
    {
      id: 1,
      jobName: 'Database Backup',
      vendor: 'AWS',
      productName: 'RDS',
      version: 'v2.3',
      keywords: 'backup, database'
    },
    {
      id: 2,
      jobName: 'Security Scan',
      vendor: 'Qualys',
      productName: 'Scanner',
      version: 'v1.8',
      keywords: 'security, scan'
    }
  ];

  newJob = {
    jobName: '',
    vendor: '',
    productName: '',
    version: '',
    keywords: ''
  };

  // Create a new job
  createJob(): void {
    if (this.newJob.jobName && this.newJob.vendor) {
      const newJob = { ...this.newJob, id: Date.now() };
      this.jobs.push(newJob);
      this.resetForm();
    }
  }


  cancelJob(jobId: number): void {
    this.jobs = this.jobs.filter(job => job.id !== jobId);
  }


  resetForm(): void {
    this.newJob = {
      jobName: '',
      vendor: '',
      productName: '',
      version: '',
      keywords: ''
    };
  }
}
