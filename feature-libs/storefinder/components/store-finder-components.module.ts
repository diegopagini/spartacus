import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import {
  CmsConfig,
  I18nModule,
  provideDefaultConfig,
  UrlModule,
} from '@spartacus/core';
import {
  IconModule,
  LayoutConfig,
  ListNavigationModule,
  SpinnerModule,
} from '@spartacus/storefront';
import { StoreFinderComponent } from './store-finder/store-finder.component';
import { StoreFinderSearchResultComponent } from './store-finder-search-result/store-finder-search-result.component';
import { StoreFinderSearchComponent } from './store-finder-search/store-finder-search.component';
import { StoreFinderHeaderComponent } from './store-finder-header/store-finder-header.component';
import { StoreFinderMapComponent } from './store-finder-map/store-finder-map.component';
import { StoreFinderGridComponent } from './store-finder-grid/store-finder-grid.component';
import { StoreFinderStoreDescriptionComponent } from './store-finder-store-description/store-finder-store-description.component';
import { StoreFinderCoreModule } from '@spartacus/storefinder/core';
import { StoreFinderListItemComponent } from './store-finder-list-item/store-finder-list-item.component';
import { StoreFinderPaginationDetailsComponent } from './store-finder-pagination-details/store-finder-pagination-details.component';
import { ScheduleComponent } from './schedule-component/schedule.component';
import { StoreFinderListComponent } from './store-finder-search-result/store-finder-list/store-finder-list.component';
import { StoreFinderStoreComponent } from './store-finder-store/store-finder-store.component';
import { StoreFinderStoresCountComponent } from './store-finder-stores-count/store-finder-stores-count.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ListNavigationModule,
    NgbTabsetModule,
    SpinnerModule,
    UrlModule,
    StoreFinderCoreModule,
    I18nModule,
    IconModule,
  ],
  providers: [
    provideDefaultConfig(<CmsConfig | LayoutConfig>{
      cmsComponents: {
        StoreFinderComponent: {
          component: StoreFinderComponent,
          childRoutes: [
            {
              path: 'find',
              component: StoreFinderSearchResultComponent,
            },
            {
              path: 'view-all',
              component: StoreFinderStoresCountComponent,
            },
            {
              path: 'country/:country',
              component: StoreFinderGridComponent,
            },
            {
              path: 'country/:country/region/:region',
              component: StoreFinderGridComponent,
            },
            {
              path: 'country/:country/region/:region/:store',
              component: StoreFinderStoreComponent,
            },
            {
              path: 'country/:country/:store',
              component: StoreFinderStoreComponent,
            },
          ],
        },
      },
    }),
  ],
  declarations: [
    StoreFinderSearchComponent,
    StoreFinderListComponent,
    StoreFinderMapComponent,
    StoreFinderListItemComponent,
    StoreFinderStoresCountComponent,
    StoreFinderGridComponent,
    StoreFinderStoreDescriptionComponent,
    ScheduleComponent,
    StoreFinderHeaderComponent,
    StoreFinderSearchResultComponent,
    StoreFinderComponent,
    StoreFinderPaginationDetailsComponent,
    StoreFinderStoreComponent,
  ],
  exports: [
    ScheduleComponent,
    StoreFinderComponent,
    StoreFinderGridComponent,
    StoreFinderHeaderComponent,
    StoreFinderListItemComponent,
    StoreFinderMapComponent,
    StoreFinderPaginationDetailsComponent,
    StoreFinderSearchComponent,
    StoreFinderSearchResultComponent,
    StoreFinderListComponent,
    StoreFinderStoreDescriptionComponent,
    StoreFinderStoresCountComponent,
    StoreFinderStoreComponent,
  ],
  entryComponents: [
    StoreFinderComponent,
    StoreFinderSearchResultComponent,
    StoreFinderStoresCountComponent,
    StoreFinderGridComponent,
    StoreFinderStoreComponent,
  ],
})
export class StoreFinderComponentsModule {}
