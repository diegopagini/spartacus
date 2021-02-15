import { Component } from '@angular/core';
import {
  CommonConfigurator,
  ConfiguratorRouterExtractorService,
} from '@spartacus/product-configurator/common';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ConfiguratorTextfieldService } from '../../core/facade/configurator-textfield.service';
import { ConfiguratorTextfield } from '../../core/model/configurator-textfield.model';

@Component({
  selector: 'cx-configurator-textfield-form',
  templateUrl: './configurator-textfield-form.component.html',
})
export class ConfiguratorTextfieldFormComponent {
  configuration$: Observable<
    ConfiguratorTextfield.Configuration
  > = this.configRouterExtractorService.extractRouterData().pipe(
    switchMap((routerData) => {
      switch (routerData.owner.type) {
        case CommonConfigurator.OwnerType.PRODUCT:
          return this.configuratorTextfieldService.createConfiguration(
            routerData.owner
          );
        case CommonConfigurator.OwnerType.CART_ENTRY:
          return this.configuratorTextfieldService.readConfigurationForCartEntry(
            routerData.owner
          );
      }
    })
  );

  constructor(
    protected configuratorTextfieldService: ConfiguratorTextfieldService,
    protected configRouterExtractorService: ConfiguratorRouterExtractorService
  ) {}

  /**
   * Updates a configuration attribute
   * @param attribute Configuration attribute, always containing a string typed value
   */
  updateConfiguration(
    attribute: ConfiguratorTextfield.ConfigurationInfo
  ): void {
    this.configuratorTextfieldService.updateConfiguration(attribute);
  }
}
