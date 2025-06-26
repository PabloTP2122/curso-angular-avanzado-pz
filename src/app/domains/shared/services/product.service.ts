import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Product } from '../models/product.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getProducts(params: { category_id?: string; category_slug?: string }) {
    const url = new URL(`${this.apiUrl}/api/v1/products`);
    if (params.category_id) {
      url.searchParams.set('categoryId', params.category_id);
    }
    if (params.category_slug) {
      url.searchParams.set('categorySlug', params.category_slug);
    }
    return this.http.get<Product[]>(url.toString());
  }

  getOne(params: { id?: string; slug?: string }) {
    if (params.id) {
      return this.http.get<Product>(
        `${this.apiUrl}/api/v1/products/${params.id}`
      );
    } else {
      return this.http.get<Product>(
        `${this.apiUrl}/api/v1/products/slug/${params.slug}`
      );
    }
  }
}
