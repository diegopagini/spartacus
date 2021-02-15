import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CartModification,
  CART_MODIFICATION_NORMALIZER,
  ConverterService,
  OccEndpointsService,
} from '@spartacus/core';
import { CommonConfigurator } from '@spartacus/product-configurator/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RulebasedConfiguratorAdapter } from '../../core/connectors/rulebased-configurator.adapter';
import { Configurator } from '../../core/model/configurator.model';
import {
  VARIANT_CONFIGURATOR_ADD_TO_CART_SERIALIZER,
  VARIANT_CONFIGURATOR_NORMALIZER,
  VARIANT_CONFIGURATOR_OVERVIEW_NORMALIZER,
  VARIANT_CONFIGURATOR_PRICE_SUMMARY_NORMALIZER,
  VARIANT_CONFIGURATOR_SERIALIZER,
  VARIANT_CONFIGURATOR_UPDATE_CART_ENTRY_SERIALIZER,
} from './variant-configurator-occ.converters';
import { OccConfigurator } from './variant-configurator-occ.models';

@Injectable()
export class VariantConfiguratorOccAdapter
  implements RulebasedConfiguratorAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpointsService: OccEndpointsService,
    protected converterService: ConverterService
  ) {}

  getConfiguratorType(): string {
    return 'CPQCONFIGURATOR';
  }

  createConfiguration(
    owner: CommonConfigurator.Owner
  ): Observable<Configurator.Configuration> {
    const productCode = owner.id;
    return this.http
      .get<OccConfigurator.Configuration>(
        this.occEndpointsService.getUrl('createVariantConfiguration', {
          productCode,
        })
      )
      .pipe(
        this.converterService.pipeable(VARIANT_CONFIGURATOR_NORMALIZER),
        map((resultConfiguration) => {
          return {
            ...resultConfiguration,
            owner: owner,
          };
        })
      );
  }

  readConfiguration(
    configId: string,
    groupId: string,
    configurationOwner: CommonConfigurator.Owner
  ): Observable<Configurator.Configuration> {
    return this.http
      .get<OccConfigurator.Configuration>(
        this.occEndpointsService.getUrl(
          'readVariantConfiguration',
          { configId },
          { groupId: groupId }
        )
      )
      .pipe(
        this.converterService.pipeable(VARIANT_CONFIGURATOR_NORMALIZER),
        map((resultConfiguration) => {
          return {
            ...resultConfiguration,
            owner: configurationOwner,
          };
        })
      );
  }

  updateConfiguration(
    configuration: Configurator.Configuration
  ): Observable<Configurator.Configuration> {
    const configId = configuration.configId;
    const url = this.occEndpointsService.getUrl('updateVariantConfiguration', {
      configId,
    });
    const occConfiguration = this.converterService.convert(
      configuration,
      VARIANT_CONFIGURATOR_SERIALIZER
    );

    return this.http.patch(url, occConfiguration).pipe(
      this.converterService.pipeable(VARIANT_CONFIGURATOR_NORMALIZER),
      map((resultConfiguration) => {
        return {
          ...resultConfiguration,
          owner: configuration.owner,
        };
      })
    );
  }

  addToCart(
    parameters: Configurator.AddToCartParameters
  ): Observable<CartModification> {
    const url = this.occEndpointsService.getUrl(
      'addVariantConfigurationToCart',
      {
        userId: parameters.userId,
        cartId: parameters.cartId,
      }
    );

    const occAddToCartParameters = this.converterService.convert(
      parameters,
      VARIANT_CONFIGURATOR_ADD_TO_CART_SERIALIZER
    );

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<CartModification>(url, occAddToCartParameters, { headers })
      .pipe(this.converterService.pipeable(CART_MODIFICATION_NORMALIZER));
  }

  readConfigurationForCartEntry(
    parameters: CommonConfigurator.ReadConfigurationFromCartEntryParameters
  ): Observable<Configurator.Configuration> {
    const url = this.occEndpointsService.getUrl(
      'readVariantConfigurationForCartEntry',
      {
        userId: parameters.userId,
        cartId: parameters.cartId,
        cartEntryNumber: parameters.cartEntryNumber,
      }
    );

    return this.http.get<OccConfigurator.Configuration>(url).pipe(
      this.converterService.pipeable(VARIANT_CONFIGURATOR_NORMALIZER),
      map((resultConfiguration) => {
        return {
          ...resultConfiguration,
          owner: parameters.owner,
        };
      })
    );
  }

  updateConfigurationForCartEntry(
    parameters: Configurator.UpdateConfigurationForCartEntryParameters
  ): Observable<CartModification> {
    const url = this.occEndpointsService.getUrl(
      'updateVariantConfigurationForCartEntry',
      {
        userId: parameters.userId,
        cartId: parameters.cartId,
        cartEntryNumber: parameters.cartEntryNumber,
      }
    );

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const occUpdateCartEntryParameters = this.converterService.convert(
      parameters,
      VARIANT_CONFIGURATOR_UPDATE_CART_ENTRY_SERIALIZER
    );

    return this.http
      .put<CartModification>(url, occUpdateCartEntryParameters, { headers })
      .pipe(this.converterService.pipeable(CART_MODIFICATION_NORMALIZER));
  }

  readConfigurationForOrderEntry(
    parameters: CommonConfigurator.ReadConfigurationFromOrderEntryParameters
  ): Observable<Configurator.Configuration> {
    const url = this.occEndpointsService.getUrl(
      'readVariantConfigurationOverviewForOrderEntry',
      {
        userId: parameters.userId,
        orderId: parameters.orderId,
        orderEntryNumber: parameters.orderEntryNumber,
      }
    );

    return this.http.get<OccConfigurator.Overview>(url).pipe(
      this.converterService.pipeable(VARIANT_CONFIGURATOR_OVERVIEW_NORMALIZER),
      map((overview) => {
        const configuration: Configurator.Configuration = {
          configId: overview.configId,
          overview: overview,
        };
        return configuration;
      }),
      map((resultConfiguration) => {
        return {
          ...resultConfiguration,
          owner: parameters.owner,
        };
      })
    );
  }

  readPriceSummary(
    configuration: Configurator.Configuration
  ): Observable<Configurator.Configuration> {
    const url = this.occEndpointsService.getUrl(
      'readVariantConfigurationPriceSummary',
      {
        configId: configuration.configId,
      }
    );

    return this.http.get(url).pipe(
      this.converterService.pipeable(
        VARIANT_CONFIGURATOR_PRICE_SUMMARY_NORMALIZER
      ),
      map((pricingResult) => {
        const result: Configurator.Configuration = {
          configId: configuration.configId,
          priceSummary: pricingResult,
        };
        return result;
      }),
      map((resultConfiguration) => {
        return {
          ...resultConfiguration,
          owner: configuration.owner,
        };
      })
    );
  }
  getConfigurationOverview(
    configId: string
  ): Observable<Configurator.Overview> {
    const url = this.occEndpointsService.getUrl(
      'getVariantConfigurationOverview',
      {
        configId,
      }
    );

    return this.http
      .get(url)
      .pipe(
        this.converterService.pipeable(VARIANT_CONFIGURATOR_OVERVIEW_NORMALIZER)
      );
  }
}
