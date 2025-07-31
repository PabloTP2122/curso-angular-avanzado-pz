import { afterNextRender, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { LocationsService } from '@shared/services/locations.service';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { Location } from '@shared/models/location.model';

@Component({
  selector: 'app-locations',
  imports: [GoogleMap, MapAdvancedMarker, FormsModule],
  templateUrl: './locations.component.html',
})
export default class LocationsComponent {
  locationsService = inject(LocationsService);
  /* center: google.maps.LatLngLiteral = {
    lat: 24,
    lng: 12,
  }; */
  //24.0192637648572, -104.6615588429324
  advancedMarkerOptions: google.maps.marker.AdvancedMarkerElementOptions = {
    gmpDraggable: false,
  };
  $origin = signal<google.maps.LatLngLiteral>({
    lat: 24.0192637648572,
    lng: -104.6615588429324,
  });
  $zoom = signal(12);

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
    console.log('Marker: ', marker);
  }
}
