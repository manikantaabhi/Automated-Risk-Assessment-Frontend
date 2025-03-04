import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { authGuard } from '../../auth.guard';

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

  constructor(private router: Router) {
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
}
