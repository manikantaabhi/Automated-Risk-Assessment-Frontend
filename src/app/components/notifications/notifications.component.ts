import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../services/loading.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { FilterPipe } from '../../pipes/filter.pipe';
import { NgChartsModule } from 'ng2-charts';
import { MarqueeComponent } from '../marquee/marquee.component';
import { MatDialog } from '@angular/material/dialog';
import { VulnerabilityPopupComponent } from '../vulnerability-popup/vulnerability-popup.component';
import { NotificationService } from '../../services/NotificationService';
import { ReportComponent } from '../report/report.component';
import * as XLSX from 'xlsx';
import * as Filesaver from 'file-saver';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-notifications',
  imports: [FormsModule,CommonModule,HttpClientModule,HeaderComponent,FooterComponent,FilterPipe,NgChartsModule,MarqueeComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  historyData: any = null;
  errorMessage: string = '';
  vulnerabilities: any;
  searchText: string = '';  // Variable to bind the search text
  currentPage: number = 1;  // To track the current page
  rowsPerPage: number = 10; // Default rows per page
  totalRows: number = 0;    // Total rows in the dataset (filtered)
  totalPages: number = 0;   // Total pages, calculated dynamically
  activeFunction:string ='list';
  selectedCve: any = null;
  displayedData: any[] = [];
  heading: string = '';
  subheading: string = '';
  infoBox: string = '';
  constructor(private router: Router, private http: HttpClient, private loadingService: LoadingService) {
    
    const navState = this.router.getCurrentNavigation()?.extras.state;
  if (navState) {
    this.vulnerabilities = navState['vulnerabilities'] || [];
    this.heading = navState['heading'] || 'Default Heading';
    this.subheading = navState['subheading'] || '';
    this.infoBox = navState['infoBox'] || '';
  }
    console.log(this.vulnerabilities);
    this.calculatePagination();
  }


  backToList() {
    this.activeFunction = 'list';
    this.selectedCve = null;
  }
  showDetails(v: any) {
    console.log("v=",v);
    this.selectedCve = structuredClone(v);
    console.log("selecred",this.selectedCve);
    this.http.get(`${environment.apiBaseUrl}/api/vulnerabilities/mitigations/${v.cveId}`, {
      responseType: 'text' as 'json'
    }).subscribe(
      (value) => {
        this.loadingService.stopLoading();
        this.selectedCve.description=v.description;
        this.selectedCve.mitigation=value;
      },
      (error) => {
        this.selectedCve.mitigation="No Mitigation Found";
        this.loadingService.stopLoading();
      }
    );

    this.activeFunction = 'details';
  }

  deleteSelected(): void {
    const selectedCveIds = this.vulnerabilities
      .filter((v: any) => v.selected)
      .map((v: any) => v.cveId);
  
    if (selectedCveIds.length === 0) {
      alert("Please select at least one vulnerability to delete.");
      return;
    }
  
    const apiUrl = `${environment.apiBaseUrl}/api/notifications/delete-cve?userName=${sessionStorage.getItem("username")}`;
  
    this.http.request('DELETE', apiUrl, {
      body: selectedCveIds,
      responseType: 'text'
    }).subscribe(
      (response) => {
        alert(response);
  
        this.vulnerabilities = this.vulnerabilities.filter(
          (v: any) => !selectedCveIds.includes(v.cveId)
        );
        this.calculatePagination();
      },
      (error) => {
        console.error("Error deleting vulnerabilities:", error);
        alert("Failed to delete vulnerabilities.");
      }
    );
  }
  
  
  

  toggleDropdown(history: any): void {
    history.showReferences = !history.showReferences;
  }
  clear(){

  }

  
  sortData(key: string) {
    this.vulnerabilities.sort((a: any, b: any) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
    this.calculatePagination();
  }

  calculatePagination() {
    const filteredData = this.getFilteredData();
    this.totalRows = filteredData.length;
    this.totalPages = Math.ceil(this.totalRows / this.rowsPerPage);
    this.displayedData = filteredData.slice((this.currentPage - 1) * this.rowsPerPage, this.currentPage * this.rowsPerPage);
  }

  getFilteredData() {
    return this.vulnerabilities.filter((v: any) => {
      if (!this.searchText) return true; // No filter applied
      const searchTerm = this.searchText.toLowerCase();
      return v.softwareName.toLowerCase().includes(searchTerm) || 
             v.version.toLowerCase().includes(searchTerm) ||
             v.cveId.toLowerCase().includes(searchTerm) ||
             v.severity.toLowerCase().includes(searchTerm) ||
             v.description.toLowerCase().includes(searchTerm);
    });
  }

  onRowsPerPageChange(value: number) {
    this.rowsPerPage = value;
    this.calculatePagination();
    this.currentPage = 1;  // Reset to first page
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.calculatePagination();  // Recalculate and update displayed data
    }
  }

  
    downloadExcel(): void {
      const exportData = this.vulnerabilities.map((v:any) => ({
        'CVE ID': v.cveId || '',
        'Description': v.description || '',
        'Resource Links': (v.references || []).map((ref: any) => ref.url).join(', ')
      }));
      console.log("exportData",this.vulnerabilities);
    
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
      const workbook: XLSX.WorkBook = { Sheets: { 'Vulnerabilities': worksheet }, SheetNames: ['Vulnerabilities'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0]; // "YYYY-MM-DD" format

      const fileName = `Vulnerabilities_Report_${formattedDate}.xlsx`;
      const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      Filesaver.saveAs(blob, fileName);
    }
}
