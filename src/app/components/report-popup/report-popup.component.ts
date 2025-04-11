import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-popup.component.html',
  styleUrls: ['./report-popup.component.css']
})
export class ReportPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<ReportPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closePopup() {
    this.dialogRef.close();
  }

  downloadJSON() {
    const blob = new Blob([JSON.stringify(this.data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vulnerabilities.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
