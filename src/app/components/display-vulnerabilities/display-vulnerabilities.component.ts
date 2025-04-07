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
import { MarqueeComponent } from "../marquee/marquee.component";

@Component({
  selector: 'app-display-vulnerabilities',
  templateUrl: './display-vulnerabilities.component.html',
  styleUrls: ['./display-vulnerabilities.component.css'],
  imports: [CommonModule, FormsModule, FilterPipe, HeaderComponent, FooterComponent, HttpClientModule, MarqueeComponent]
})
export class DisplayVulnerabilitiesComponent {
  selectedService: string = '';
  vulnerabilities: any;
  activeFunction:string ='list';
  selectedCve: any = null;
  inputData: any;
  searchText: string = '';  // Variable to bind the search text
  currentPage: number = 1;  // To track the current page
  rowsPerPage: number = 10; // Default rows per page
  totalRows: number = 0;    // Total rows in the dataset (filtered)
  totalPages: number = 0;   // Total pages, calculated dynamically
  sortKey: string = ''; // To track the key to sort
  sortOrder: string = 'asc'; // Ascending or descending order
  
  constructor(private router: Router, public dialog: MatDialog, private http: HttpClient, private loadingService: LoadingService) {
    const navigation = this.router.getCurrentNavigation();
    this.vulnerabilities = navigation?.extras.state?.['vulnerabilities'] || [];
    console.log(this.vulnerabilities);
    this.inputData = navigation?.extras.state?.['inputData'] || [];
    this.vulnerabilities = this.vulnerabilities.map((v: any) => ({ ...v, selected: false })); // Add 'selected' property
    this.calculatePagination();
  }

  highlightService(serviceId: string) {
    this.selectedService = serviceId;
    setTimeout(() => {
      this.selectedService = ''; // Remove highlight after 3 seconds
    }, 3000);
  }

  showDetails(v: any) {
    this.selectedCve = structuredClone(v);
    this.http.get(`http://localhost:8080/api/vulnerabilities/mitigations/${v.cveId}`, {
      responseType: 'text' as 'json'
    }).subscribe(
      (value) => {
        this.loadingService.stopLoading();
        this.selectedCve.mitigation=value;
      },
      (error) => {
        this.selectedCve.mitigation="No Mitigation Found";
        this.loadingService.stopLoading();
      }
    );

    this.activeFunction = 'details';
  }
  
  backToList() {
    this.activeFunction = 'list';
    this.selectedCve = null;
  }

  // Sort function that handles any key (softwareName, version, cveId, etc.)
  sortData(key: string) {
    if (this.sortKey === key) {
      // Toggle sort order if the same column is clicked
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Set default to ascending order when a new column is clicked
      this.sortOrder = 'asc';
    }
    this.sortKey = key;
  
    this.vulnerabilities.sort((a: any, b: any) => {
      let comparison = 0;
  
      // Handle sorting for nested properties like metrics.severity
      if (key === 'metrics.severity') {
        // Access severity from the first element of the metrics array
        const severityA = a.metrics && a.metrics.length > 0 ? a.metrics[0].severity : '';
        const severityB = b.metrics && b.metrics.length > 0 ? b.metrics[0].severity : '';
        
        // Compare severity values
        if (severityA < severityB) {
          comparison = -1;
        } else if (severityA > severityB) {
          comparison = 1;
        }
      } else {
        // Default sorting for other properties (e.g., cveId, description)
        const aValue = a[key];
        const bValue = b[key];
        if (aValue < bValue) {
          comparison = -1;
        } else if (aValue > bValue) {
          comparison = 1;
        }
      }
  
      return this.sortOrder === 'asc' ? comparison : -comparison;
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

  // Filter data based on search input (across all relevant columns)
  getFilteredData() {
    return this.vulnerabilities.filter((v: any) => {
      const searchText = this.searchText.toLowerCase().trim();
      
      const softwareName = v.softwareName ? v.softwareName.toLowerCase() : '';
      const version = v.version ? v.version.toLowerCase() : '';
      const cveId = v.cveId ? v.cveId.toLowerCase() : '';
      const description = v.description ? v.description.toLowerCase() : '';
      const severity=v.severity?v.severity.toLowerCase():"";
  
      return softwareName.includes(searchText) || 
             version.includes(searchText) || 
             cveId.includes(searchText) ||
             severity.includes(searchText) ||  // Now filters based on all severity values
             description.includes(searchText);
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
      this.vulnerabilities = result.vulnerabilities || result; // Ensure it's accessing the right key
      this.inputData = result.inputData || []; // Capture inputData
      this.currentPage = 1;
      this.calculatePagination();
    });
  }

  get displayedData() {
    const filteredData = this.getFilteredData(); // Ensure filtering happens first
    this.totalRows = filteredData.length; // Update total count dynamically
    this.totalPages = Math.ceil(this.totalRows / this.rowsPerPage); // Recalculate pages
  
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
  
    return filteredData.slice(startIndex, endIndex); // Apply pagination correctly
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
      this.loadingService.stopLoading();
      return;
    }

    const cveIds = selectedVulnerabilities.map((x: any) => x.cveId);
    const requestPayload = {
      username: sessionStorage.getItem('username'),
      cveId: cveIds
    };

    this.http.post('http://localhost:8080/api/vulnerabilities/save-vulnerabilities', requestPayload).subscribe(
      () => {
        this.loadingService.stopLoading();
        alert('Selected vulnerabilities saved successfully!');
      },
      (error) => {
        this.loadingService.stopLoading();
        alert("Error: " + error.error.message);
      }
    );
  }
}
