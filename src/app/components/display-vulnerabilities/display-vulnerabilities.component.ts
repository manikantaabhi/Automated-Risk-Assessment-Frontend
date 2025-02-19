import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterPipe } from '../../pipes/filter.pipe';
import { MatDialog } from '@angular/material/dialog';
import { VulnerabilityPopupComponent } from '../vulnerability-popup/vulnerability-popup.component';

@Component({
  selector: 'app-display-vulnerabilities',
  templateUrl: './display-vulnerabilities.component.html',
  styleUrls: ['./display-vulnerabilities.component.css'],
  imports:[CommonModule, FormsModule, FilterPipe]
})
export class DisplayVulnerabilitiesComponent {

  vulnerabilities: any;
  searchText: string = '';  // Variable to bind the search text
  currentPage: number = 1;  // To track the current page
  rowsPerPage: number = 10; // Default rows per page
  totalRows: number = 0;    // Total rows in the dataset (filtered)
  totalPages: number = 0;   // Total pages, calculated dynamically

  constructor(private router: Router,public dialog:MatDialog) {
    const navigation = this.router.getCurrentNavigation();
    this.vulnerabilities = navigation?.extras.state?.['vulnerabilities'] || [];
    this.calculatePagination();
  }

  // Function to handle sorting by a specific column
  sortData(key: string) {
    this.vulnerabilities.sort((a: any, b: any) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
    this.calculatePagination(); // Recalculate pagination when sorting
  }

  // Function to change the rows per page
  onRowsPerPageChange(value: number) {
    this.rowsPerPage = value;
    this.calculatePagination(); // Recalculate pagination when rows per page changes
    this.currentPage = 1; // Reset to the first page
  }

  // Function to calculate pagination based on filtered data
  calculatePagination() {
    const filteredData = this.getFilteredData(); // Get filtered data based on search text
    this.totalRows = filteredData.length; // Set the total number of rows based on filtered data
    this.totalPages = Math.ceil(this.totalRows / this.rowsPerPage); // Calculate total pages
  }

  // Function to get filtered data based on search text
 getFilteredData() {
  return this.vulnerabilities.filter((v: any) => {
    // Handle undefined or null values for each field
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

checkVulnerabilities() {
  const dialogRef = this.dialog.open(VulnerabilityPopupComponent, {
    width: '100%', // Adjust width for responsiveness
    disableClose: true, // Prevent clicking outside to close
  });

  // Handle the dialog close event
  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.vulnerabilities = result;     // ✅ Update vulnerabilities with the new data
      this.currentPage = 1;              // Reset to the first page
      this.calculatePagination();        // Recalculate pagination
    }
  });
}
  // Function to calculate the data to display for the current page
  get displayedData() {
    const filteredData = this.getFilteredData(); // Filter the data based on search text
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    return filteredData.slice(startIndex, endIndex); // Slice the filtered data based on current page and rows per page
  }

  // Function to handle page changes
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
