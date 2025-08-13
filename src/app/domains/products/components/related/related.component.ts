import { Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductService } from '@shared/services/product.service';
import { ProductComponent } from '../product/product.component';

@Component({
  selector: 'app-related',
  imports: [ProductComponent],
  templateUrl: './related.component.html',
})
export class RelatedComponent {
  $slug = input.required<string>({ alias: 'slug' });
  private productService = inject(ProductService);

  relatedProducts = rxResource({
    params: () => ({ slug: this.$slug() }),
    stream: ({ params }) => this.productService.getRelatedProducts(params.slug),
  });
}
