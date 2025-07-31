import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapsLoaderService {
  private document = inject(DOCUMENT);
  private isLoaded$ = new ReplaySubject<boolean>(1);
  private scriptLoading = false;

  load(): Observable<boolean> {
    if (this.scriptLoading) {
      return this.isLoaded$.asObservable();
    }

    this.scriptLoading = true;
    const script = this.document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.isLoaded$.next(true);
      this.isLoaded$.complete();
    };
    script.onerror = error => {
      this.isLoaded$.error(error);
    };
    this.document.head.appendChild(script);
    return this.isLoaded$.asObservable();
  }
}
