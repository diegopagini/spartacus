import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  CurrencyService,
  I18nModule,
  OrgUnitService,
  UrlModule,
} from '@spartacus/core';
import { FormErrorsModule } from '../../../../shared/components/form/form-errors/form-errors.module';
import { CurrencyFormModule } from '../../common/currency/currency-form.module';
import { CostCenterFormComponent } from './cost-center-form.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgSelectModule,
    UrlModule,
    I18nModule,
    ReactiveFormsModule,
    FormErrorsModule,
    CurrencyFormModule,
  ],
  declarations: [CostCenterFormComponent],
  exports: [CostCenterFormComponent],
  providers: [CurrencyService, OrgUnitService],
  entryComponents: [CostCenterFormComponent],
})
export class CostCenterFormModule {}