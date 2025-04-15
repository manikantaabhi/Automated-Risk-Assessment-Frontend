import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private http: HttpClient) {}

  getUnreadCount(name: string): Observable<number> {
    return this.http.get<number>(`http://localhost:8080/api/notifications/count?userName=${name}`);
  }

  getAllNotifications(name: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`http://localhost:8080/api/notifications/all?userName=${name}`);
  }
}
