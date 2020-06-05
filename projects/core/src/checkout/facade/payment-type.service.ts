import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import {
  pluck,
  shareReplay,
  tap,
  withLatestFrom,
  take,
  map,
} from 'rxjs/operators';
import { PaymentType } from '../../model/cart.model';
import { StateWithProcess } from '../../process/store/process-state';
import { AuthService } from '../../auth/facade/auth.service';
import { ActiveCartService } from '../../cart/facade/active-cart.service';
import { OCC_USER_ID_ANONYMOUS } from '../../occ/utils/occ-constants';
import { getProcessStateFactory } from '../../process/store/selectors/process-group.selectors';
import { CheckoutActions } from '../store/actions/index';
import {
  GET_PAYMENT_TYPES_PROCESS_ID,
  StateWithCheckout,
} from '../store/checkout-state';
import { CheckoutSelectors } from '../store/selectors/index';

@Injectable({
  providedIn: 'root',
})
export class PaymentTypeService {
  readonly ACCOUNT_PAYMENT = 'ACCOUNT';

  constructor(
    protected checkoutStore: Store<StateWithCheckout | StateWithProcess<void>>,
    protected authService: AuthService,
    protected activeCartService: ActiveCartService
  ) {}

  /**
   * Get payment types
   */
  getPaymentTypes(): Observable<PaymentType[]> {
    return this.checkoutStore.pipe(
      select(CheckoutSelectors.getAllPaymentTypes),
      withLatestFrom(
        this.checkoutStore.pipe(
          select(getProcessStateFactory(GET_PAYMENT_TYPES_PROCESS_ID))
        )
      ),
      tap(([, loadingState]) => {
        if (
          !(loadingState.loading || loadingState.success || loadingState.error)
        ) {
          this.loadPaymentTypes();
        }
      }),
      pluck(0),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  /**
   * Load the supported payment types
   */
  loadPaymentTypes(): void {
    this.checkoutStore.dispatch(new CheckoutActions.LoadPaymentTypes());
  }

  /**
   * Set payment type to cart
   * @param typeCode
   * @param poNumber : purchase order number
   */
  setPaymentType(typeCode: string, poNumber?: string): void {
    let cartId;
    this.activeCartService
      .getActiveCartId()
      .pipe(take(1))
      .subscribe((activeCartId) => (cartId = activeCartId));

    this.authService.invokeWithUserId((userId) => {
      if (userId && userId !== OCC_USER_ID_ANONYMOUS && cartId) {
        this.checkoutStore.dispatch(
          new CheckoutActions.SetPaymentType({
            userId: userId,
            cartId: cartId,
            typeCode: typeCode,
            poNumber: poNumber,
          })
        );
      }
    });
  }

  /**
   * Get the selected payment type
   */
  getSelectedPaymentType(): Observable<string> {
    return combineLatest([
      this.activeCartService.getActive(),
      this.checkoutStore.pipe(select(CheckoutSelectors.getSelectedPaymentType)),
    ]).pipe(
      tap(([cart, selected]) => {
        if (selected === undefined) {
          if (cart && cart.paymentType) {
            this.checkoutStore.dispatch(
              new CheckoutActions.SetPaymentTypeSuccess(cart)
            );
          } else {
            // set to the default type: account
            this.setPaymentType(this.ACCOUNT_PAYMENT);
          }
        }
      }),
      map(([_, selected]) => selected)
    );
  }

  /**
   * Get whether the selected payment type is "ACCOUNT" payment
   */
  isAccountPayment(): Observable<boolean> {
    return this.getSelectedPaymentType().pipe(
      map((selected) => selected === this.ACCOUNT_PAYMENT)
    );
  }

  /**
   * Get PO Number
   */
  getPoNumber(): Observable<string> {
    return combineLatest([
      this.activeCartService.getActive(),
      this.checkoutStore.pipe(select(CheckoutSelectors.getPoNumer)),
    ]).pipe(
      tap(([cart, po]) => {
        if (po === undefined && cart && cart.purchaseOrderNumber) {
          this.checkoutStore.dispatch(
            new CheckoutActions.SetPaymentTypeSuccess(cart)
          );
        }
      }),
      map(([_, po]) => po)
    );
  }
}
