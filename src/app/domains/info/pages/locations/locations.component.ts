import { afterNextRender, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { LocationsService } from '@shared/services/locations.service';

@Component({
  selector: 'app-locations',
  imports: [],
  templateUrl: './locations.component.html',
})
export default class LocationsComponent {
  locationsService = inject(LocationsService);
  $origin = signal('');

  constructor() {
    afterNextRender(() => {
      navigator.geolocation.getCurrentPosition(position => {
        const origin = `${position.coords.latitude},${position.coords.longitude}`;
        this.$origin.set(origin);
      });
    });
  }

  locations = rxResource({
    params: () => ({ origin: this.$origin() }),
    stream: ({ params }) =>
      this.locationsService.getLocationsByOrigin(params.origin),
  });
}
