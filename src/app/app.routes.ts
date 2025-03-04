import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { VulnerabilityPopupComponent } from './components/vulnerability-popup/vulnerability-popup.component';
import { DisplayVulnerabilitiesComponent } from './components/display-vulnerabilities/display-vulnerabilities.component';
import { WelcomePageComponent } from './components/welcomepage/welcomepage.component';
import { FooterComponent } from './components/footer/footer.component';
import { authGuard } from './auth.guard';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { 
    path: '', 
    component: HomeComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'vulnerability', 
    component: VulnerabilityPopupComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'display-vulnerabilities',
    component: DisplayVulnerabilitiesComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'welcomepage', 
    component: WelcomePageComponent,
    canActivate: [authGuard]
  }
];
