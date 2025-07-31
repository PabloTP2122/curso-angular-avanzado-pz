import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { MapsLoaderService } from '../services/maps-loader.service';
import { catchError, map, of } from 'rxjs';

export const loadMapsApiGuard: CanActivateFn = () => {
  const mapsLoaderService = inject(MapsLoaderService);

  return mapsLoaderService.load().pipe(
    map(() => true), // Si el script se carga, permite la activación de la ruta.
    catchError(error => {
      console.error('Error al cargar la API de Google Maps', error);
      // Opcionalmente, podrías redirigir a una página de error.
      // const router = inject(Router);
      // return router.createUrlTree(['/error-page']);
      return of(false); // Bloquea la activación de la ruta en caso de error.
    })
  );
};
