import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-user-guide',
  imports: [CommonModule,HeaderComponent],
  templateUrl: './user-guide.component.html',
  styleUrl: './user-guide.component.css'
})
export class UserGuideComponent {
  selectedService: string = ''; // Tracks the highlighted service

  expandedSections: boolean[] = [false, false, false, false, false];

  toggleSection(index: number): void {
    this.expandedSections[index] = !this.expandedSections[index];
  }
  highlightService(serviceId: string) {
    this.selectedService = serviceId;
    setTimeout(() => {
      this.selectedService = ''; // Remove highlight after 3 seconds
    }, 3000);
  }

}
