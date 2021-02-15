import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  ActiveCartService,
  ConsignmentEntry,
  FeatureConfigService,
  OrderEntry,
  PromotionLocation,
  SelectiveCartService,
} from '@spartacus/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CartItemComponentOptions } from '../cart-item/cart-item.component';

@Component({
  selector: 'cx-cart-item-list',
  templateUrl: './cart-item-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemListComponent {
  @Input() readonly = false;

  @Input() hasHeader = true;

  @Input() options: CartItemComponentOptions = {
    isSaveForLater: false,
    optionalBtn: null,
  };

  private _items: OrderEntry[] = [];
  form: FormGroup = this.featureConfigService?.isLevel('3.1')
    ? new FormGroup({})
    : undefined;

  @Input('items')
  set items(items: OrderEntry[]) {
    this.resolveItems(items);
    this.createForm();
  }
  get items(): OrderEntry[] {
    return this._items;
  }

  @Input() promotionLocation: PromotionLocation = PromotionLocation.ActiveCart;

  @Input('cartIsLoading') set setLoading(value: boolean) {
    if (!this.readonly) {
      // Whenver the cart is loading, we disable the complete form
      // to avoid any user interaction with the cart.
      value
        ? this.form.disable({ emitEvent: false })
        : this.form.enable({ emitEvent: false });
    }
  }

  constructor(
    protected activeCartService: ActiveCartService,
    protected selectiveCartService: SelectiveCartService,
    public featureConfigService?: FeatureConfigService
  ) {}

  /**
   * The items we're getting form the input do not have a consistent model.
   * In case of a `consignmentEntry`, we need to normalize the data from the orderEntry.
   */
  private resolveItems(items: OrderEntry[]): void {
    if (!items) {
      this._items = [];
      return;
    }

    if (items.every((item) => item.hasOwnProperty('orderEntry'))) {
      this._items = items.map((consignmentEntry) => {
        const entry = Object.assign(
          {},
          (consignmentEntry as ConsignmentEntry).orderEntry
        );
        entry.quantity = consignmentEntry.quantity;
        return entry;
      });
    } else {
      // We'd like to avoid the unnecessary re-renders of unchanged cart items after the data reload.
      // OCC cart entries don't have any unique identifier that we could use in Angular `trackBy`.
      // So we update each array element to the new object only when it's any different to the previous one.
      if (this.featureConfigService?.isLevel('3.1')) {
        for (let i = 0; i < items.length; i++) {
          if (JSON.stringify(this._items?.[i]) !== JSON.stringify(items[i])) {
            this._items[i] = items[i];
          }
        }
      } else {
        this._items = items;
      }
    }
  }

  private createForm(): void {
    if (!this.featureConfigService?.isLevel('3.1')) {
      this.form = new FormGroup({});
    }

    this._items.forEach((item) => {
      const controlName = this.getControlName(item);
      const group = new FormGroup({
        entryNumber: new FormControl(item.entryNumber),
        quantity: new FormControl(item.quantity, { updateOn: 'blur' }),
      });
      if (!item.updateable || this.readonly) {
        group.disable();
      }
      this.form.addControl(controlName, group);
    });
  }

  protected getControlName(item: OrderEntry): string {
    return item.entryNumber.toString();
  }

  removeEntry(item: OrderEntry): void {
    if (this.selectiveCartService && this.options.isSaveForLater) {
      this.selectiveCartService.removeEntry(item);
    } else {
      this.activeCartService.removeEntry(item);
    }
    delete this.form.controls[this.getControlName(item)];
  }

  getControl(item: OrderEntry): Observable<FormGroup> {
    return this.form.get(this.getControlName(item)).valueChanges.pipe(
      // tslint:disable-next-line:deprecation
      startWith(null),
      map((value) => {
        if (value && this.selectiveCartService && this.options.isSaveForLater) {
          this.selectiveCartService.updateEntry(
            value.entryNumber,
            value.quantity
          );
        } else if (value) {
          this.activeCartService.updateEntry(value.entryNumber, value.quantity);
        }
      }),
      map(() => <FormGroup>this.form.get(this.getControlName(item)))
    );
  }
}
