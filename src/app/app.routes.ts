import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { VulnerabilityPopupComponent } from './components/vulnerability-popup/vulnerability-popup.component';
import { DisplayVulnerabilitiesComponent } from './components/display-vulnerabilities/display-vulnerabilities.component';

export const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: '', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'vulnerability', component: VulnerabilityPopupComponent },
  { path: 'display-vulnerabilities',component: DisplayVulnerabilitiesComponent}
];
