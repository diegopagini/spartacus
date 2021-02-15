import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { provideDefaultConfig } from '../config/config-providers';
import { provideConfigValidator } from '../config/config-validator/config-validator';
import { AsmOccModule } from './adapters/asm/asm-occ.module';
import { CartOccModule } from './adapters/cart/cart-occ.module';
import { CheckoutOccModule } from './adapters/checkout/checkout-occ.module';
import { CmsOccModule } from './adapters/cms/cms-occ.module';
import { CostCenterOccModule } from './adapters/cost-center/cost-center-occ.module';
import { ProductOccModule } from './adapters/product/product-occ.module';
import { SiteContextOccModule } from './adapters/site-context/site-context-occ.module';
import { UserOccModule } from './adapters/user/user-occ.module';
import { OccConfigLoaderModule } from './config-loader/occ-config-loader.module';
import { defaultOccConfig } from './config/default-occ-config';
import { occConfigValidator } from './config/occ-config-validator';
import { WithCredentialsInterceptor } from './interceptors/with-credentials.interceptor';

/**
 * @deprecated since 3.1, use individual imports instead
 */
@NgModule({
  imports: [
    AsmOccModule,
    CmsOccModule,
    CartOccModule,
    CheckoutOccModule,
    ProductOccModule,
    SiteContextOccModule,
    UserOccModule,
    OccConfigLoaderModule.forRoot(),
    CostCenterOccModule,
  ],
})
export class OccModule {
  static forRoot(): ModuleWithProviders<OccModule> {
    return {
      ngModule: OccModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useExisting: WithCredentialsInterceptor,
          multi: true,
        },
        provideDefaultConfig(defaultOccConfig),
        provideConfigValidator(occConfigValidator),
      ],
    };
  }
}
