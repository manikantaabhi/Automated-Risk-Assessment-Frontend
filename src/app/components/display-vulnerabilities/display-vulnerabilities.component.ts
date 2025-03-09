import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterPipe } from '../../pipes/filter.pipe';
import { MatDialog } from '@angular/material/dialog';
import { VulnerabilityPopupComponent } from '../vulnerability-popup/vulnerability-popup.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-display-vulnerabilities',
  templateUrl: './display-vulnerabilities.component.html',
  styleUrls: ['./display-vulnerabilities.component.css'],
  imports:[CommonModule, FormsModule, FilterPipe, HeaderComponent, FooterComponent,HttpClientModule]
})
export class DisplayVulnerabilitiesComponent {
  selectedService: string = '';
  vulnerabilities: any;
  searchText: string = '';  // Variable to bind the search text
  currentPage: number = 1;  // To track the current page
  rowsPerPage: number = 10; // Default rows per page
  totalRows: number = 0;    // Total rows in the dataset (filtered)
  totalPages: number = 0;   // Total pages, calculated dynamically
  
  constructor(private router: Router, public dialog: MatDialog, private http: HttpClient, private loadingService:LoadingService) {
    const navigation = this.router.getCurrentNavigation();
    this.vulnerabilities = navigation?.extras.state?.['vulnerabilities'] || [];
    this.vulnerabilities = this.vulnerabilities.map((v: any) => ({ ...v, selected: false })); // Add 'selected' property
    this.calculatePagination();
  }

  highlightService(serviceId: string) {
    this.selectedService = serviceId;
    setTimeout(() => {
      this.selectedService = ''; // Remove highlight after 3 seconds
    }, 3000);
  }

  sortData(key: string) {
    this.vulnerabilities.sort((a: any, b: any) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
    this.calculatePagination();
  }

  onRowsPerPageChange(value: number) {
    this.rowsPerPage = value;
    this.calculatePagination();
    this.currentPage = 1;
  }

  calculatePagination() {
    const filteredData = this.getFilteredData();
    this.totalRows = filteredData.length;
    this.totalPages = Math.ceil(this.totalRows / this.rowsPerPage);
  }

  getFilteredData() {
    return this.vulnerabilities.filter((v: any) => {
      const softwareName = v.softwareName ? v.softwareName.toLowerCase() : '';
      const version = v.version ? v.version.toLowerCase() : '';
      const cveId = v.cveId ? v.cveId.toLowerCase() : '';
      const severity = v.severity ? v.severity.toLowerCase() : '';
      const description = v.description ? v.description.toLowerCase() : '';
      return softwareName.includes(this.searchText.toLowerCase()) || 
             version.includes(this.searchText.toLowerCase()) || 
             cveId.includes(this.searchText.toLowerCase()) ||
             severity.includes(this.searchText.toLowerCase()) ||
             description.includes(this.searchText.toLowerCase());
    });
  }

  toggleDropdown(v: any) {
    v.showReferences = !v.showReferences;
  }

  checkVulnerabilities() {
    const dialogRef = this.dialog.open(VulnerabilityPopupComponent, {
      width: '100%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.vulnerabilities = result;
        this.currentPage = 1;
        this.calculatePagination();
      }
    });
  }

  get displayedData() {
    const filteredData = this.getFilteredData();
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Save selected vulnerabilities to the database
  saveSelected() {
    this.loadingService.startLoading();
    const selectedVulnerabilities = this.vulnerabilities.filter((v: any) => v.selected);
    
    if (selectedVulnerabilities.length === 0) {
      alert('No vulnerabilities selected!');
      return;
    }
  
    const requestPayload = {
      username:sessionStorage.getItem('username'),
      vulnerabilities: selectedVulnerabilities
    };
    console.log(requestPayload);
    this.http.post('http://localhost:8080/api/vulnerabilities/save-vulnerabilities', requestPayload).subscribe(
      () => {
        this.loadingService.stopLoading()
        alert('Selected vulnerabilities saved successfully!')
      },
      (error) => {
        console.log(error)
        this.loadingService.stopLoading()
        alert("Error: "+error.error.message)
      }
    );
  }
  
}