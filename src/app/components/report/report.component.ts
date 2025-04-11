import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

// Standalone module setup
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DisplayReportComponent } from '../display-report/display-report.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
 

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, FormsModule, DisplayReportComponent ]})

export class ReportComponent {
  // Define the form structure
  reportForm: FormGroup;
    // ✅ Custom validator: Ensures 'end' is not before 'start'
dateRangeValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const start = group.get('start')?.value;
  const end = group.get('end')?.value;

  if (start && end && new Date(end) < new Date(start)) {
    return { dateRangeInvalid: true };
  }
  return null;
};
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReportComponent>, // used to close the popup
    private http: HttpClient,private dialog: MatDialog,private router: Router
  ) 

  {
    // Initialize the form fields with default values (empty)
    this.reportForm = this.fb.group({
      make: [''],     // Text input
      product: [''],  // Text input
      version: [''],  // Text input
      type: [''],     // Text input
      keyword: [''],  // Text input
      file: [null],   // File input
      start: [''],    // Start date
      end: ['']       // End date
    });
    
  }

  // ✅ Handler for when the user selects a file
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.reportForm.patchValue({ file }); // Bind selected file to form
    }
  }

  // ✅ Submit the form and send data to the backend
  submitForm() {
    const formData = new FormData(); // multipart/form-data format

    const values = this.reportForm.value;

    // Only append non-empty values (to avoid sending null/undefined)
    if (values.make) formData.append('make', values.make);
    if (values.product) formData.append('productName', values.product);
    if (values.version) formData.append('version', values.version);
    if (values.type) formData.append('type', values.type);
    if (values.keyword) formData.append('keywords', values.keyword);
    if (values.file) formData.append('file', values.file);

    // These are required, so append them unconditionally
    formData.append('fromDate', values.start);
    formData.append('toDate', values.end);

    // ✅ Send POST request to Spring Boot backend
    this.http.post<any>('http://localhost:8080/api/vulnerabilities/report', formData).subscribe({
      next: (response) => {
        console.log("Response from backend: ", response);
        this.dialogRef.close(); // Optionally close after successful submit
        this.router.navigate(['/display-report'], { state: { reportData: response } });
      },
      error: (err) => {
        console.error('Error submitting report:', err);
        alert('Something went wrong while submitting the report!');
      }
    });
  }

  // ✅ Close the popup when "X" button is clicked
  onCloseClick() {
    this.dialogRef.close();
  }
}


