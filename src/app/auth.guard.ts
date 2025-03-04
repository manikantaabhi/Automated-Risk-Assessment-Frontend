import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  try {
    // Use window.sessionStorage explicitly
    const isLoggedIn = window.sessionStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
      router.navigate(['/login']);
      return false;
    }
    return true;
  } catch (error) {
    // If there's any error accessing sessionStorage, redirect to login
    router.navigate(['/login']);
    return false;
  }
};
