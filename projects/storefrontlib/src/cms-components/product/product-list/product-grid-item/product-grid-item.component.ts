import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  Optional,
  SimpleChanges,
} from '@angular/core';
import { ProductListOutlets } from '../../product-outlets.model';
import { ProductListItemContextSource } from '../model/product-list-item-context-source.model';
import { ProductListItemContext } from '../model/product-list-item-context.model';

@Component({
  selector: 'cx-product-grid-item',
  templateUrl: './product-grid-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ProductListItemContextSource,
    {
      provide: ProductListItemContext,
      useExisting: ProductListItemContextSource,
    },
  ],
})
export class ProductGridItemComponent implements OnChanges {
  readonly ProductListOutlets = ProductListOutlets;
  @Input() product: any;

  // TODO(#10946): make ProductListItemContextSource a required dependency
  // tslint:disable-next-line: unified-signatures
  constructor(productListItemContextSource: ProductListItemContextSource);
  /**
   * @deprecated since 3.1
   */
  constructor();
  constructor(
    @Optional()
    protected productListItemContextSource?: ProductListItemContextSource
  ) {}

  ngOnChanges(changes?: SimpleChanges): void {
    if (changes?.product) {
      this.productListItemContextSource?.product$.next(this.product);
    }
  }
}
