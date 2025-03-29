import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

// Define Notification interface inline
export interface Notification {
  id?: number;
  userId: number;
  jobId: number;
  message: string;
  read?: boolean;
  createdAt?: string;
}

// Define a minimal User interface for our lookup
export interface User {
  id: number;
  username: string;
  email?: string;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notifications: Notification[] = [];
  userId: number = 0;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    const userIdString = sessionStorage.getItem('userId');
    if (userIdString) {
      this.userId = parseInt(userIdString, 10);
      this.loadNotifications();
    } else {
      console.error('No userId found in sessionStorage');
    }
  }

  loadNotifications(): void {
    console.log("Loading notifications for userId:", this.userId);
    this.notificationService.getNotificationsByUser(this.userId).subscribe(
      (data: Notification[]) => {
        this.zone.run(() => {
          this.notifications = data;
          console.log("Notifications loaded:", data);
        });
      },
      error => console.error('Error loading notifications', error)
    );
  }

  refreshNotifications(): void {
    this.loadNotifications();
  }

  markAsRead(notification: Notification): void {
    if (notification.id !== undefined) {
      this.notificationService.markAsRead(notification.id).subscribe(
        () => {
          this.zone.run(() => {
            this.notifications = this.notifications.filter(n => n.id !== notification.id);
          });
        },
        error => console.error('Error marking notification as read', error)
      );
    } else {
      console.error('Notification id is missing');
    }
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
