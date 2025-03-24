import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { authGuard } from '../../auth.guard';

import { MatDialog } from '@angular/material/dialog';
import { VulnerabilityPopupComponent } from '../vulnerability-popup/vulnerability-popup.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HeaderComponent {
  @Output() serviceSelected = new EventEmitter<string>(); // Emits selected service to WelcomeComponent
  isDropdownOpen = false; // Tracks dropdown state
  isLoggedIn = false;  // Add this property

  lastScrollY = 0;
  isHeaderVisible = true;
  // Listen to the window scroll event
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const currentScrollY = window.scrollY;

    // If the user scrolls up, show the header; if down, hide it
    if (currentScrollY < this.lastScrollY) {
      this.isHeaderVisible = true;  // Show header on scroll up
    } else {
      this.isHeaderVisible = false; // Hide header on scroll down
    }

    // Update the last scroll position
    this.lastScrollY = currentScrollY;
  }

  // Return the visibility class for the header
  getHeaderClass() {
    return this.isHeaderVisible ? 'show' : '';
  }

  constructor(private router: Router,public dialog: MatDialog) {
    this.isLoggedIn =true;
  }

  // Toggle dropdown visibility
  toggleDropdown(event: Event) {
    event.stopPropagation(); // Prevents dropdown from closing immediately
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Scroll to a service and highlight it
  scrollToService(serviceId: string) {
    const element = document.getElementById(serviceId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.serviceSelected.emit(serviceId); // Send selected service to WelcomeComponent
    }
    this.isDropdownOpen = false; // Close dropdown after selecting a service
  }

  // Scroll to About Us / Contact Us
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Close dropdown if user clicks outside
  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (!(event.target as HTMLElement).closest('.dropdown')) {
      this.isDropdownOpen = false;
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  onLogin(type: string) {
    this.router.navigate([type]); // Navigate to login/signup page
  }
  onLogout(type: string) {
    sessionStorage.clear();
    this.router.navigate(['/login']); // Navigate to login/signup page
  }
  
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

  viewHistory() {
    this.router.navigate(['/history']); // Navigate to HistoryComponent
  }
}
