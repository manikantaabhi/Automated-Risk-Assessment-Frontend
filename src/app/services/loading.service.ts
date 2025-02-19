import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false); // Start with false
  loading$ = this.loadingSubject.asObservable(); // Observable to subscribe

  constructor() {}

  startLoading() {
    this.loadingSubject.next(true); // Show the spinner
  }

  stopLoading() {
    this.loadingSubject.next(false); // Hide the spinner
  }
}
