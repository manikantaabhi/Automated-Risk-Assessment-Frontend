import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-guide',
  imports: [CommonModule],
  templateUrl: './user-guide.component.html',
  styleUrl: './user-guide.component.css'
})
export class UserGuideComponent {

  expandedSections: boolean[] = [false, false, false, false, false];

  toggleSection(index: number): void {
    this.expandedSections[index] = !this.expandedSections[index];
  }

}
