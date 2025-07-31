import { Routes } from '@angular/router';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { NotFoundComponent } from '@info/pages/not-found/not-found.component';
import { loadMapsApiGuard } from './domains/shared/guards/maps.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'category/:slug',
        loadComponent: () =>
          import('./domains/products/pages/list/list.component'),
      },
      {
        path: '',
        loadComponent: () =>
          import('./domains/products/pages/list/list.component'),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./domains/info/pages/about/about.component'),
      },
      {
        path: 'product/:slug',
        loadComponent: () =>
          import(
            './domains/products/pages/product-detail/product-detail.component'
          ),
      },
      {
        path: 'locations',
        canActivate: [loadMapsApiGuard],
        loadComponent: () =>
          import('./domains/info/pages/locations/locations.component'),
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
