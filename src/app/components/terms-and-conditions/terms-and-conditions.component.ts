import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-terms-and-conditions',
  imports: [],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.css'
})
export class TermsAndConditionsComponent {

  constructor(private location: Location) {}

  date: Date = new Date(); // Current date
  year: number = this.date.getFullYear(); // Current year
  currentDate: string = this.date.toLocaleDateString(); // Current date in locale format
  currentTime: string = this.date.toLocaleTimeString(); // Current time in locale format
  
  goBack(): void {
    this.location.back();
  }
}
