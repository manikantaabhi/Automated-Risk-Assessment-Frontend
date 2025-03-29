import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Notification {
  id?: number;
  userId: number;
  jobId: number;
  message: string;
  createdAt?: string;
  read?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = '/api/notifications';

  getNotificationsByUser(userId: number): Observable<Notification[]> {
    return new Observable<Notification[]>(subscriber => {
      fetch(`${this.baseUrl}?userId=${userId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          return response.json();
        })
        .then((data: Notification[]) => {
          subscriber.next(data);
          subscriber.complete();
        })
        .catch(err => subscriber.error(err));
    });
  }

  markAsRead(notificationId: number): Observable<any> {
    return new Observable<any>(subscriber => {
      fetch(`${this.baseUrl}/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ read: true })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          subscriber.next(data);
          subscriber.complete();
        })
        .catch(err => subscriber.error(err));
    });
  }
}
