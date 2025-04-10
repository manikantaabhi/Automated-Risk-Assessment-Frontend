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

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  imports:[FormsModule,CommonModule,HttpClientModule,HeaderComponent,FooterComponent,FilterPipe,NgChartsModule]
})
export class HistoryComponent implements OnInit {
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
  constructor(private router: Router, private http: HttpClient, private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.fetchHistoryData();
  }

  fetchHistoryData(): void {
    const apiUrl = 'http://localhost:8080/api/vulnerabilities/history/'+sessionStorage.getItem("username");
    

    this.http.get<any>(apiUrl).subscribe(
      (response) => {
        this.loadingService.stopLoading();
        this.historyData = response; // assuming response is an array of vulnerability history
        this.vulnerabilities=response;
        console.log('API Response:', response);
      },
      (error) => {
        this.loadingService.stopLoading();
        this.errorMessage = 'Error fetching history data';
        console.error('Error fetching History data:', error);
      }
    );
  }

  backToList() {
    this.activeFunction = 'list';
    this.selectedCve = null;
  }
  showDetails(v: any) {
    console.log("v=",v);
    this.selectedCve = structuredClone(v);
    console.log("selecred",this.selectedCve);
    this.http.get(`http://localhost:8080/api/vulnerabilities/mitigations/${v.cveId}`, {
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
    const selectedCveIds = this.historyData
      .filter((v: any) => v.selected)
      .map((v: any) => v.cveId);
  
    if (selectedCveIds.length === 0) {
      alert("Please select at least one vulnerability to delete.");
      return;
    }
  
    const apiUrl = `http://localhost:8080/api/vulnerabilities/history/delete?username=${sessionStorage.getItem("username")}`;
    
    this.http.request('DELETE', apiUrl, { 
      body: selectedCveIds, 
      responseType: 'text'  // Expect a text response
    }).subscribe(
      (response) => {
        alert(response); // Show the success message
  
        // 🔥 Remove deleted vulnerabilities from the local list (UI update)
        this.historyData = this.historyData.filter((v: any) => !v.selected);
        this.vulnerabilities = this.vulnerabilities.filter((v: any) => !v.selected);
  
        // 🔄 Recalculate pagination
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
  }
  onRowsPerPageChange(value: number) {
    this.rowsPerPage = value;
    this.calculatePagination();
    this.currentPage = 1;
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
  
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

}


