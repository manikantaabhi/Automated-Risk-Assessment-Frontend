import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  message: string = '';

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      console.log('File selected:', this.selectedFile?.name, 'Size:', this.selectedFile?.size, 'bytes');
    } else {
      console.warn('No file was selected.');
    }
  }

  async onSubmit(): Promise<void> {
    console.log('onSubmit triggered');
    if (!this.selectedFile) {
      this.message = 'No file selected.';
      console.warn('No file selected!');
      return;
    }

    console.log('Uploading file:', this.selectedFile.name, 'Size:', this.selectedFile.size, 'bytes');

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // Retrieve the user ID from session storage
    const sessionUserId = sessionStorage.getItem('userId');
    if (sessionUserId) {
      formData.append('userId', sessionUserId);
      console.log('User ID retrieved from sessionStorage:', sessionUserId);
    } else {
      console.warn('No user ID found in session storage. Ensure that the user is logged in.');
      this.message = 'User not authenticated. Please log in and try again.';
      return;
    }

    try {
      console.log('Sending POST request with file:', this.selectedFile.name, 'and userId:', sessionUserId);
      const response = await fetch('http://localhost:8080/uploadFile', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.status);
      }

      const res = await response.json();
      console.log('Response received:', res);
      this.message = res.message || 'File uploaded successfully.';
    } catch (err) {
      console.error('Error during file upload:', err);
      this.message = 'Error uploading file.';
    }
  }
}
