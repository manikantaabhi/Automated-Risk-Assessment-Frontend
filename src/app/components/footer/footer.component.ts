import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  year:any;
  constructor( private router: Router) {
this.year=new Date().getFullYear();
  }
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  viewAbout() {
    this.router.navigate(['/about']); // Navigate to HistoryComponent
  }
  viewContact() {
    this.router.navigate(['/contact']); // Navigate to HistoryComponent
  }
  viewTerms() {
    this.router.navigate(['/terms']); // Navigate to HistoryComponent
  }
}
