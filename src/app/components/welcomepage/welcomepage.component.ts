import { Component, AfterViewInit, Inject, PLATFORM_ID, Renderer2,HostListener  } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common'; // Required for standalone components
import { FooterComponent } from '../footer/footer.component'; // Import FooterComponent

declare var bootstrap: any; // Ensures Bootstrap JS is recognized

@Component({
  selector: 'app-welcomepage',
  standalone: true,  // Mark as standalone
  templateUrl: './welcomepage.component.html',
  styleUrls: ['./welcomepage.component.css'],
  imports: [CommonModule, HeaderComponent, FooterComponent] // Import HeaderComponent,FooterComponent & CommonModule
})
export class WelcomePageComponent {
  selectedService: string = ''; // Tracks the highlighted service
  clickedServices: { [key: string]: boolean } = {}; // Tracks clicked services separately

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
  
  constructor(private router: Router, private renderer: Renderer2) {}

  // Scroll to a specific section
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
   
  onLogin(page: string) {
    if (page === 'login') {
      this.router.navigate(['/login']);
    } else if (page === 'signup') {
      this.router.navigate(['/signup']);
    }
  }
}
