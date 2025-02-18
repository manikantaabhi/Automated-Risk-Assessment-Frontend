import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { VulnerabilityPopupComponent } from './components/vulnerability-popup/vulnerability-popup.component';
import { DisplayVulnerabilitiesComponent } from './components/display-vulnerabilities/display-vulnerabilities.component';

export const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  //{ path: '', component: ResetPasswordComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'vulnerability', component: VulnerabilityPopupComponent },
  { path: 'display-vulnerabilities',component: DisplayVulnerabilitiesComponent}
];
