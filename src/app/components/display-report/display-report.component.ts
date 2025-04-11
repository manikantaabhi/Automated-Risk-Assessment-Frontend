
import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { MatDialog } from '@angular/material/dialog';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-display-report',
  standalone: true,
  imports: [CommonModule,NgChartsModule,HeaderComponent],
  templateUrl: './display-report.component.html',
  styleUrls: ['./display-report.component.css']
})
export class DisplayReportComponent {
  selectedService: string = '';
  Math = Math;
  data: any;

  // ✅ NEW: Array to hold multiple charts
  chartConfigs: { title: string, chartData: ChartConfiguration<'bar'>['data'] }[] = [];
  currentPage = 1;
  chartsPerPage = 6;
  paginatedCharts: { title: string, chartData: ChartConfiguration<'bar'>['data'] }[] = [];

  // Chart Variables
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Vulnerabilities by Year' }
    }
  };

  constructor(private router: Router) {
    this.data = this.router.getCurrentNavigation()?.extras.state?.['reportData'];
    if (this.data?.graphData) {
      this.prepareMultipleCharts(this.data.graphData); // NEW METHOD
      this.updatePaginatedCharts(); // ✅ NEW: initialize first page
    }
  }
  highlightService(serviceId: string) {
    this.selectedService = serviceId;
    setTimeout(() => {
      this.selectedService = ''; // Remove highlight after 3 seconds
    }, 3000);
  }

  prepareMultipleCharts(graphData: any[]) {
    graphData.forEach(item => {
      const firstKey = item.dataPoints.length > 0 ? (item.dataPoints[0].month ? 'month' : 'year') : 'year';
  
      // ✅ NEW: Sort the data points by firstKey
      const sortedDataPoints = item.dataPoints.sort((a: any, b: any) => {
        return a[firstKey].localeCompare(b[firstKey]);
      });
  
      const labels = sortedDataPoints.map((dp: any) => dp[firstKey]);
      const data = sortedDataPoints.map((dp: any) => dp.count);
  
      const title = `${item.make} - ${item.product} - ${item.version} (${item.type})`;
  
      const chartData: ChartConfiguration<'bar'>['data'] = {
        labels,
        datasets: [{
          data,
          label: 'Vulnerabilities',
          backgroundColor: '#42A5F5'
        }]
      };
  
      this.chartConfigs.push({ title, chartData });
    });
    this.updatePaginatedCharts();
  }
  updatePaginatedCharts() {
    const start = (this.currentPage - 1) * this.chartsPerPage;
    const end = start + this.chartsPerPage;
    this.paginatedCharts = this.chartConfigs.slice(start, end);
  }

  // ✅ NEW: Next/Prev buttons
  nextPage() {
    if (this.currentPage < Math.ceil(this.chartConfigs.length / this.chartsPerPage)) {
      this.currentPage++;
      this.updatePaginatedCharts();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedCharts();
    }
  }
}