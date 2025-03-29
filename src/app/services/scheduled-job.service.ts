import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ScheduledJob {
  id?: number;
  jobName: string;
  vendor: string;
  productName: string;
  version: string;
  keywords: string;
  userId: number;
  status?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ScheduledJobService {
  private baseUrl = '/api/scheduled-jobs';

  // Fetch jobs for a user from the backend.
  getJobsByUser(userId: number): Observable<ScheduledJob[]> {
    return new Observable<ScheduledJob[]>(subscriber => {
      fetch(`${this.baseUrl}?userId=${userId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          return response.json();
        })
        .then((data: ScheduledJob[]) => {
          subscriber.next(data);
          subscriber.complete();
        })
        .catch(err => subscriber.error(err));
    });
  }

  // Create a job by sending a POST request to the backend.
  createJob(job: ScheduledJob): Observable<ScheduledJob> {
    return new Observable<ScheduledJob>(subscriber => {
      fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          return response.json();
        })
        .then((data: ScheduledJob) => {
          subscriber.next(data);
          subscriber.complete();
        })
        .catch(err => subscriber.error(err));
    });
  }

  // Cancel a job by sending a DELETE request.
  cancelJob(jobId: number): Observable<any> {
    return new Observable<any>(subscriber => {
      fetch(`${this.baseUrl}/${jobId}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          subscriber.next(null);
          subscriber.complete();
        })
        .catch(err => subscriber.error(err));
    });
  }
}
