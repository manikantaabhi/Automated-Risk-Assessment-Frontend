import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { VulnerabilityPopupComponent } from '../vulnerability-popup/vulnerability-popup.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, HeaderComponent, FooterComponent]
})
export class HomeComponent {
  selectedService: string = ''; // Tracks the highlighted service
  clickedServices: { [key: string]: boolean } = {}; // Tracks clicked services separately

  constructor(private router: Router, public dialog: MatDialog) {}

  // Function to handle service button clicks
  onServiceClick(serviceId: string) {
    this.clickedServices = { ...this.clickedServices, [serviceId]: true };
  }

  // Highlight selected service for 3 seconds
  highlightService(serviceId: string) {
    this.selectedService = serviceId;
    setTimeout(() => {
      this.selectedService = ''; // Remove highlight after 3 seconds
    }, 3000);
  }

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

  // Navigate to notifications page
  viewNotifications() {
    this.router.navigate(['/notifications']);
  }

  // Function to view reports
  viewReports() {
    alert('Viewing reports...');
  }

  // Navigate to schedule jobs page
  scheduleJob() {
    this.router.navigate(['/schedule-jobs']);
  }

  // Function to view scan history
  viewHistory() {
    alert('Viewing past scans and history...');
  }

  // Navigate to file upload page
  goToFileUpload() {
    this.router.navigate(['/file-upload']);
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
