import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Location } from '@shared/models/location.model';

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getLocationsByOrigin(origin: string): Observable<Location[]> {
    if (!origin) {
      //Para consistencia
      return of([]);
    }
    const params = new HttpParams().set('origin', origin);
    return this.http.get<Location[]>(`${this.apiUrl}/api/v1/locations`, {
      params,
    });
  }
}
