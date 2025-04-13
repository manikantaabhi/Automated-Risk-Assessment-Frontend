import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // ✅ Add this
import { MatDialog } from '@angular/material/dialog';
import { VulnerabilityPopupComponent } from '../vulnerability-popup/vulnerability-popup.component';
import { ReportComponent } from '../report/report.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule,HttpClientModule]
})
export class HeaderComponent {
  @Output() serviceSelected = new EventEmitter<string>(); // Emits selected service to WelcomeComponent
  isDropdownOpen = false; // Tracks dropdown state
  isLoggedIn = false;  // Add this property
  username:any;
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

  constructor(private router: Router,public dialog: MatDialog, private http: HttpClient) {
    this.isLoggedIn =true;
    this.username=sessionStorage.getItem("username");
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
  viewAbout() {
    this.router.navigate(['/about']); // Navigate to HistoryComponent
  }
  viewContact() {
    this.router.navigate(['/contact']); // Navigate to HistoryComponent
  }

  viewReports() {
      this.dialog.open(ReportComponent, {
        width: '700px',
        disableClose: false, // Allow clicking outside to close (optional)
        autoFocus: true
      });
    }

  // file upload 

  showUploadModal = false;
selectedFile!: File;

openUploadModal() {
  this.showUploadModal = true;
}

closeUploadModal() {
  this.showUploadModal = false;
}

onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
}

uploadFile() {
  if (!this.selectedFile) return;

  const formData = new FormData();
  formData.append('file', this.selectedFile);
  formData.append('username', sessionStorage.getItem("username")!); // Append username to form data

  this.http.post('http://localhost:8080/api/vulnerabilities/excel', formData).subscribe({
    next: (res) => {
      alert('File uploaded successfully!');
      this.closeUploadModal();
    },
    error: (err) => {
      alert(err.error?.error);
      console.error(err);
    }
  });
}


  // end of flie upload
}
