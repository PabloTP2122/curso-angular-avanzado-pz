import {
  afterNextRender,
  Component,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { LocationsService } from '@shared/services/locations.service';
import {
  GoogleMap,
  MapAdvancedMarker,
  MapInfoWindow,
} from '@angular/google-maps';
import { Location } from '@shared/models/location.model';
import { environment } from '@env/environment';

@Component({
  selector: 'app-locations',
  imports: [GoogleMap, MapAdvancedMarker, FormsModule, MapInfoWindow],
  templateUrl: './locations.component.html',
})
export default class LocationsComponent {
  locationsService = inject(LocationsService);
  // 24.0192637648572, -104.6615588429324
  // Bogotá: 4.655121008091634, -74.05599827967885
  infoWindowRef = viewChild.required(MapInfoWindow);
  markersRef = viewChildren(MapAdvancedMarker);

  $origin = signal<google.maps.LatLngLiteral>({
    lat: 4.655121008091634,
    lng: -74.05599827967885,
  });
  $zoom = signal(12);
  readonly mapId = environment.googleMapsMapId;
  customIconElement: HTMLElement | undefined;

  constructor() {
    afterNextRender(() => {
      navigator.geolocation.getCurrentPosition(position => {
        const origin = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.$origin.set(origin);
      });
    });
    // Example of creating a custom SVG icon element
    const svgString = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `;
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    this.customIconElement = svgDoc.documentElement;
  }

  $locations = rxResource({
    params: () => ({ origin: this.$origin() }),
    stream: ({ params }) =>
      this.locationsService.getLocationsByOrigin({
        lat: params.origin.lat,
        lng: params.origin.lng,
      }),
  });

  //Agregando info window
  openInfoWindow(location: Location, marker: MapAdvancedMarker) {
    console.log('Location: ', location);
    console.log('Marker', marker);
    const content = `
    <h1 class="text-slate-600 font-semibold text-lg">${location.name}</h1>
    <p class="text-slate-400">${location.description}</p>
    `;
    this.infoWindowRef().open(marker, false, content);
  }

  goToPlace(location: Location, index: number) {
    const markers = this.markersRef();
    const marker = markers[index];

    this.openInfoWindow(location, marker);
  }
}
