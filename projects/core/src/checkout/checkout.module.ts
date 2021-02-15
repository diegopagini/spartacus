import { ModuleWithProviders, NgModule } from '@angular/core';
import { PageMetaResolver } from '../cms/page/page-meta.resolver';
import { CheckoutEventModule } from './events/checkout-event.module';
import { interceptors } from './http-interceptors/index';
import { CheckoutPageMetaResolver } from './services/checkout-page-meta.resolver';
import { CheckoutStoreModule } from './store/checkout-store.module';

@NgModule({
  imports: [CheckoutStoreModule, CheckoutEventModule],
})
export class CheckoutModule {
  static forRoot(): ModuleWithProviders<CheckoutModule> {
    return {
      ngModule: CheckoutModule,
      providers: [
        ...interceptors,
        {
          provide: PageMetaResolver,
          useExisting: CheckoutPageMetaResolver,
          multi: true,
        },
      ],
    };
  }
}
