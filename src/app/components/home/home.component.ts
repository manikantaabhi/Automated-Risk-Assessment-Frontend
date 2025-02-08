import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router) {}

  // Handle "Check Vulnerabilities" button click
  checkVulnerabilities() {
    alert('Vulnerability check initiated!');
    // Add logic for vulnerability check if needed
  }

  // Function to navigate to notifications page or show alerts
  viewNotifications() {
    alert('Showing notifications...');
    // Implement actual notification logic if needed
  }

  // Function to view reports
  viewReports() {
    alert('Viewing reports...');
    // Implement report viewing logic
  }

  // Function to schedule a job
  scheduleJob() {
    alert('Scheduling a security scan...');
    // Implement scheduling logic
  }

  // Function to view scan history
  viewHistory() {
    alert('Viewing past scans and history...');
    // Implement history retrieval logic
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
  onLogin(page:string) {
    if(page==='login')
      this.router.navigate(['/login']); // Redirects to the Login page
    else if(page ==='signup')
      this.router.navigate(['/signup']); // Redirects to the Login page
  }
}
