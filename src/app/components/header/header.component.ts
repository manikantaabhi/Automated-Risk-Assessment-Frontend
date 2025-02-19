import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


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
}
