import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../src/environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private http: HttpClient) {}

  getUnreadCount(name: string): Observable<number> {
    return this.http.get<number>(`${environment.apiBaseUrl}/api/notifications/count?userName=${name}`);
  }

  getAllNotifications(name: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${environment.apiBaseUrl}/api/notifications/all?userName=${name}`);
  }
  getAllUserVulnerabilities(name: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${environment.apiBaseUrl}/api/jobs/all?userName=${name}`);
  }

  getScheduledJobsNotifications(name: string): Observable<number> {
    return this.http.get<number>(`${environment.apiBaseUrl}/api/jobs/count?userName=${name}`);
  }
}
