import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http'; // Import this

// Modify appConfig to include HttpClientModule provider
bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideHttpClient() // Ensure HttpClient is provided here
  ]
})
  .catch((err) => console.error(err));
