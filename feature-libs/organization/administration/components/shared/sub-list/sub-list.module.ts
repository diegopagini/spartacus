import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { PaginationModule, TableModule } from '@spartacus/storefront';
import { CardModule } from '../card/card.module';
import { MessageModule } from '../message/message.module';
import { AssignCellComponent } from './assign-cell.component';
import { SubListComponent } from './sub-list.component';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    CardModule,
    TableModule,
    PaginationModule,

    MessageModule,
  ],
  declarations: [SubListComponent, AssignCellComponent],
  exports: [SubListComponent],
})
export class SubListModule {}
