import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { VulnerabilityPopupComponent } from '../vulnerability-popup/vulnerability-popup.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router, public dialog: MatDialog) {}

  // Open the vulnerability popup
  checkVulnerabilities() {
    const dialogRef = this.dialog.open(VulnerabilityPopupComponent, {
      width: '100%', // Adjust width for responsiveness
      disableClose: true, // Prevent clicking outside to close
    });

    // Handle the dialog close event
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'checked') {
        alert('Vulnerability check initiated!');
        // Add logic for vulnerability scanning here
      }
    });
  }

  // Function to navigate to notifications page or show alerts
  viewNotifications() {
    alert('Showing notifications...');
  }

  // Function to view reports
  viewReports() {
    alert('Viewing reports...');
  }

  // Function to schedule a job
  scheduleJob() {
    alert('Scheduling a security scan...');
  }

  // Function to view scan history
  viewHistory() {
    alert('Viewing past scans and history...');
  }

  // Navigate to specific pages
  navigateTo(page: string) {
    switch (page) {
      case 'about':
        alert('Navigating to About Us...');
        break;
      case 'services':
        alert('Navigating to Services...');
        break;
      case 'contact':
        alert('Navigating to Contact Us...');
        break;
      case 'notification':
        alert('Recent Notifications loading...');
        break;
      default:
        alert('Page not found!');
    }
  }

  // Login and Signup Navigation
  onLogin(page: string) {
    if (page === 'login') this.router.navigate(['/login']);
    else if (page === 'signup') this.router.navigate(['/signup']);
  }
}
