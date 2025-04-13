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
import { HistoryComponent } from './components/history/history.component';
import { DisplayReportComponent } from './components/display-report/display-report.component';
import { UserGuideComponent } from './components/user-guide/user-guide.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'app-user-guide', component: UserGuideComponent },
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
    path: 'about', 
    component: AboutUsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'contact', 
    component: ContactUsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'terms', 
    component: TermsAndConditionsComponent,
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
  },
  { 
    path: 'history', 
    component: HistoryComponent,
    canActivate: [authGuard]
  },
  { path: 'display-report', 
    component: DisplayReportComponent,
    canActivate: [authGuard]
  },

];
