import { Component, effect, inject, input, linkedSignal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProductService } from '@shared/services/product.service';
import { Product } from '@shared/models/product.model';
import { CartService } from '@shared/services/cart.service';
import { Meta, Title } from '@angular/platform-browser';
import { rxResource } from '@angular/core/rxjs-interop';
import { environment } from '@env/environment';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './product-detail.component.html',
})
export default class ProductDetailComponent {
  readonly slug = input.required<string>();
  productRs = rxResource({
    params: () => ({ slug: this.slug() }),
    stream: ({ params }) => this.productService.getBySlug(params.slug),
  });

  $cover = linkedSignal({
    source: this.productRs.value,
    computation: (product, previousValue) => {
      return product && product?.images.length > 0
        ? product.images[0]
        : previousValue?.value;
    },
  });
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  //Meta tags dinámicas
  titleService = inject(Title);
  metaService = inject(Meta);

  constructor() {
    effect(() => {
      const product = this.productRs.value();
      if (product) {
        this.titleService.setTitle(product.title);
        this.metaService.updateTag({
          name: 'og:title',
          content: product.title,
        });
        this.metaService.updateTag({
          name: 'og:image',
          content: product.images[0],
        });
        this.metaService.updateTag({
          name: 'og:description',
          content: product.description,
        });
        this.metaService.updateTag({
          name: 'og:url',
          content: `${environment.domain}/product/${product.slug}`,
        });
      }
    });
  }

  changeCover(newImg: string) {
    this.$cover.set(newImg);
  }

  addToCart() {
    const product = this.productRs.value() as Product | undefined;
    if (product) {
      this.cartService.addToCart(product);
    }
  }
}
