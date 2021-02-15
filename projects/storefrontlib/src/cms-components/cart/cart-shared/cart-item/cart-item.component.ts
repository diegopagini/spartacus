import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  OrderEntry,
  PromotionLocation,
  PromotionResult,
} from '@spartacus/core';
import { Observable } from 'rxjs';
import { PromotionService } from '../../../../shared/services/promotion/promotion.service';
import { ICON_TYPE } from '../../../misc/icon/icon.model';
import { CartOutlets } from '../../cart-outlets.model';
import { CartItemContextSource } from './model/cart-item-context-source.model';
import { CartItemContext } from './model/cart-item-context.model';

/**
 * @deprecated since 3.0 - use `OrderEntry` instead
 */
export interface Item {
  entryNumber?: number;
  product?: any;
  quantity?: any;
  basePrice?: any;
  totalPrice?: any;
  updateable?: boolean;
  statusSummaryList?: any[];
  configurationInfos?: any[];
}

export interface CartItemComponentOptions {
  isSaveForLater?: boolean;
  optionalBtn?: any;
}

@Component({
  selector: 'cx-cart-item',
  templateUrl: './cart-item.component.html',
  providers: [
    CartItemContextSource,
    { provide: CartItemContext, useExisting: CartItemContextSource },
  ],
})
export class CartItemComponent implements OnInit, OnChanges {
  @Input() compact = false;
  @Input() item: OrderEntry;
  @Input() readonly = false;
  @Input() quantityControl: FormControl;

  @Input() promotionLocation: PromotionLocation = PromotionLocation.ActiveCart;

  // TODO: evaluate whether this is generic enough
  @Input() options: CartItemComponentOptions = {
    isSaveForLater: false,
    optionalBtn: null,
  };

  appliedProductPromotions$: Observable<PromotionResult[]>;
  iconTypes = ICON_TYPE;
  readonly CartOutlets = CartOutlets;

  // TODO(#10946): make CartItemContextSource a required dependency
  // tslint:disable-next-line: unified-signatures
  constructor(
    promotionService: PromotionService,
    // tslint:disable-next-line: unified-signatures
    cartItemContextSource: CartItemContextSource
  );
  /**
   * @deprecated since 3.1
   */
  constructor(promotionService: PromotionService);
  constructor(
    protected promotionService: PromotionService,
    @Optional() protected cartItemContextSource?: CartItemContextSource
  ) {}

  ngOnInit() {
    this.appliedProductPromotions$ = this.promotionService.getProductPromotionForEntry(
      this.item,
      this.promotionLocation
    );
  }

  ngOnChanges(changes?: SimpleChanges) {
    if (changes?.compact) {
      this.cartItemContextSource?.compact$.next(this.compact);
    }
    if (changes?.readonly) {
      this.cartItemContextSource?.readonly$.next(this.readonly);
    }
    if (changes?.item) {
      this.cartItemContextSource?.item$.next(this.item);
    }
    if (changes?.quantityControl) {
      this.cartItemContextSource?.quantityControl$.next(this.quantityControl);
    }
    if (changes?.promotionLocation) {
      this.cartItemContextSource?.promotionLocation$.next(
        this.promotionLocation
      );
    }
    if (changes?.options) {
      this.cartItemContextSource?.options$.next(this.options);
    }
  }

  isProductOutOfStock(product: any) {
    // TODO Move stocklevelstatuses across the app to an enum
    return (
      product &&
      product.stock &&
      product.stock.stockLevelStatus === 'outOfStock'
    );
  }

  removeItem() {
    this.quantityControl.setValue(0);
    this.quantityControl.markAsDirty();
  }
}
