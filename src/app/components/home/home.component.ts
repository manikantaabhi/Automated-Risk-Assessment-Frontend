import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { VulnerabilityPopupComponent } from '../vulnerability-popup/vulnerability-popup.component';
import { ReportComponent } from '../report/report.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { MarqueeComponent } from "../marquee/marquee.component";

import { NotificationService } from '../../services/NotificationService';
import { LoadingService } from '../../services/loading.service';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, HeaderComponent, FooterComponent, MarqueeComponent],
  standalone: true
})
export class HomeComponent {
  selectedService = '';
  clickedServices: { [key: string]: boolean } = {};
  notificationCount = 0;
  vulnerabilities: any[] = [];
  notifications: any[] = [];

  vulnerabilitiesCount = 0;// this is the count of user specific vulnerabilities
  vulnerabilitiesList: any[] = [];// this is the list of user specific vulnerabilities

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public notificationService: NotificationService,
    public loadingService: LoadingService
  ) {}

  ngOnInit() {
    const username = sessionStorage.getItem('username') || '';
    this.notificationService.getUnreadCount(username).subscribe(count => {
      this.notificationCount = count;
    });

    this.notificationService.getScheduledJobsNotifications(username).subscribe(count => {
      this.vulnerabilitiesCount = count;
    });
  }

  onServiceClick(serviceId: string) {
    this.clickedServices = { ...this.clickedServices, [serviceId]: true };
  }

  highlightService(serviceId: string) {
    this.selectedService = serviceId;
    setTimeout(() => this.selectedService = '', 3000);
  }

  checkVulnerabilities() {
    const dialogRef = this.dialog.open(VulnerabilityPopupComponent, {
      width: '100%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'checked') {
        alert('Vulnerability check initiated!');
        // Additional scanning logic here
      }
    });
  }

  viewNotifications() {
    this.loadingService.startLoading();
    const username = sessionStorage.getItem('username') || '';

    this.notificationService.getAllNotifications(username).subscribe(vulnerabilities => {
      this.vulnerabilities = vulnerabilities;
      this.loadingService.stopLoading();

      if (this.vulnerabilities.length > 0) {
        this.router.navigate(['/notifications'], {
          state: {
            vulnerabilities: this.vulnerabilities,
            heading: 'Vulnerabilities',
            infoBox: `
              These vulnerabilities are newly published in the <strong>National Vulnerability Database (NVD)</strong>.
              Some entries may be generic or not directly tied to your specific products because NVD has not yet provided exact <strong>CPE</strong> matches.
              Therefore, these vulnerabilities <strong>may or may not affect your systems</strong>.
            `
          }
        });
        
      } else {
        alert('No new notifications!');
      }
    });
  }

  viewReports() {
    this.dialog.open(ReportComponent, {
      width: '700px',
      disableClose: false,
      autoFocus: true
    });
  }

  scheduleJob() {
    this.router.navigate(['/schedule']);
  }

  ViewVulnerabilities() {
    this.loadingService.startLoading();
    const username = sessionStorage.getItem('username') || '';

    this.notificationService.getAllUserVulnerabilities(username).subscribe(vulnerabilities => {
      this.vulnerabilities = vulnerabilities;
      this.loadingService.stopLoading();

      if (this.vulnerabilities.length > 0) {
        this.router.navigate(['/notifications'], {
          state: {
            vulnerabilities: this.vulnerabilities,
            heading: 'Vulnerabilities for your products',
            infoBox: `
            Since you have registered for the product, we are notifying you about the vulnerabilities for your products. Since NVD does cpe matching after taking some time, you are notifying whenever they are available..
          `
          }
        });
      } else {
        alert('No new vulnerabilities for your products!');
      }
    });
  }

  viewHistory() {
    this.router.navigate(['/history']);
  }

  viewOthers() {
    this.router.navigate(['/app-user-guide']);
  }

  navigateTo(page: string) {
    const messages: any = {
      about: 'Navigating to About Us...',
      services: 'Navigating to Services...',
      contact: 'Navigating to Contact Us...',
      notification: 'Recent Notifications loading...'
    };

    alert(messages[page] || 'Page not found!');
  }

  onLogin(page: string) {
    if (page === 'login') {
      this.router.navigate(['/login']);
    } else if (page === 'signup') {
      this.router.navigate(['/signup']);
    }
  }
}
