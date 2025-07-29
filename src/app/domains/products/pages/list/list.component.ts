import { Component, inject, signal, input, resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { ProductComponent } from '@products/components/product/product.component';

import { Product } from '@shared/models/product.model';
import { CartService } from '@shared/services/cart.service';
import { ProductService } from '@shared/services/product.service';
import { CategoryService } from '@shared/services/category.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-list',
  imports: [CommonModule, ProductComponent, RouterLinkWithHref],
  templateUrl: './list.component.html',
})
export default class ListComponent {
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  readonly slug = input<string>();
  products = signal<Product[]>([]);

  categoriesResource = rxResource({
    stream: () => this.categoryService.getAll(),
  });

  //Ejemplo con resource
  categoriesResourcePromise = resource({
    loader: () => this.categoryService.getAllPromise(),
  });
  //Ejemplo con rxResource
  productsResource = rxResource({
    params: () => ({ category_slug: this.slug() }),
    stream: ({ params }) => this.productService.getProducts(params),
  });

  //Ejemplo con resource
  productResourcePromise = resource({
    params: () => ({ category_slug: this.slug() }),
    loader: ({ params }) =>
      this.productService.getProductsPromise(params.category_slug!),
  });

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  resetCategories() {
    this.categoriesResource.set([]);
  }
  reloadCategories() {
    this.categoriesResource.reload();
  }

  reloadProducts() {
    this.productsResource.reload();
  }
}
