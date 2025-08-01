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
import { MarkerIconPipe } from '@shared/pipes/marker-icon.pipe';

@Component({
  selector: 'app-locations',
  imports: [
    GoogleMap,
    MapAdvancedMarker,
    FormsModule,
    MapInfoWindow,
    MarkerIconPipe,
  ],
  templateUrl: './locations.component.html',
})
export default class LocationsComponent {
  locationsService = inject(LocationsService);
  // 24.0192637648572, -104.6615588429324
  // Bogotá: 4.655121008091634, -74.05599827967885
  infoWindowRef = viewChild.required(MapInfoWindow);
  //iconRef = viewChild<ElementRef>('icon');
  markersRef = viewChildren(MapAdvancedMarker);

  $origin = signal<google.maps.LatLngLiteral>({
    lat: 4.655121008091634,
    lng: -74.05599827967885,
  });
  $zoom = signal(12);
  readonly mapId = environment.googleMapsMapId;

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
