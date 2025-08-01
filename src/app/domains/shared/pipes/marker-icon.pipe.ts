import { Pipe, PipeTransform } from '@angular/core';
import { Location } from '@shared/models/location.model';

@Pipe({
  name: 'markerIcon',
})
export class MarkerIconPipe implements PipeTransform {
  // Caché para almacenar los íconos ya creados.
  // La clave será el ID de la ubicación, el valor será el HTMLElement del ícono.
  private iconCache = new Map<number, HTMLElement>();

  private readonly iconContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="#0AE98A" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728z"/>
        <path d="M12 9a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" fill="#000" />
      </svg>
    `;
  transform(location: Location): HTMLElement {
    // 1. Si el ícono para esta ubicación ya existe en el caché, lo retornamos.
    if (this.iconCache.has(location.id)) {
      return this.iconCache.get(location.id)!;
    }

    // 2. Si no existe, lo creamos por primera vez.
    const image = document.createElement('img');
    const svgDataUri = 'data:image/svg+xml;base64,' + btoa(this.iconContent);
    image.src = svgDataUri;
    image.width = 44;
    image.height = 44;

    // 3. Lo guardamos en el caché para usos futuros.
    this.iconCache.set(location.id, image);

    return image;
  }
}
