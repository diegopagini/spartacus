import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GlobalMessageComponentModule } from './cms-components/misc/global-message/global-message.module';
import { OutletModule } from './cms-structure/outlet/outlet.module';
import { OutletRefModule } from './cms-structure/outlet/outlet-ref/outlet-ref.module';
import { PageLayoutModule } from './cms-structure/page/page-layout/page-layout.module';
import { PageSlotModule } from './cms-structure/page/slot/page-slot.module';
import { PwaModule } from './cms-structure/pwa/pwa.module';
import { RoutingModule } from './cms-structure/routing/routing.module';
import { SeoModule } from './cms-structure/seo/seo.module';
import { LayoutModule } from './layout/layout.module';
import { SkipLinkModule } from './layout/a11y/skip-link/skip-link.module';
import { KeyboardFocusModule } from './layout/a11y/keyboard-focus/keyboard-focus.module';
import { MediaModule } from './shared/components/media/media.module';
import { BaseCoreModule } from '@spartacus/core';

@NgModule({
  declarations: [],
  imports: [
    BaseCoreModule.forRoot(),
    RouterModule,
    GlobalMessageComponentModule,
    OutletModule,
    OutletRefModule,
    PwaModule,
    PageLayoutModule,
    SeoModule,
    PageSlotModule,
    SkipLinkModule,
    KeyboardFocusModule,
    LayoutModule,
    RoutingModule.forRoot(),
    MediaModule.forRoot(),
    OutletModule.forRoot(),
  ],
  exports: [LayoutModule],
})
export class BaseStorefrontModule {}
