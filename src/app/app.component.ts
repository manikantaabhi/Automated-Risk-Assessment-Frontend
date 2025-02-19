import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { GlobalSpinnerComponent } from './components/global-spinner/global-spinner.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,GlobalSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AutomatedRiskAssessmentFrontEnd';
}
