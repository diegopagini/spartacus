import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { CommonConfigurator } from '@spartacus/product-configurator/common';
import { Observable, of } from 'rxjs';
import { ConfiguratorGroupsService } from '../../core/facade/configurator-groups.service';
import { Configurator } from '../../core/model/configurator.model';
import { ConfiguratorStorefrontUtilsService } from './configurator-storefront-utils.service';

let isGroupVisited: Observable<boolean> = of(false);

class MockConfiguratorGroupsService {
  isGroupVisited(): Observable<boolean> {
    return isGroupVisited;
  }
}

describe('ConfigUtilsService', () => {
  let classUnderTest: ConfiguratorStorefrontUtilsService;

  const owner: CommonConfigurator.Owner = {
    id: 'testProduct',
    type: CommonConfigurator.OwnerType.PRODUCT,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ConfiguratorGroupsService,
          useClass: MockConfiguratorGroupsService,
        },
      ],
    });
    classUnderTest = TestBed.inject(ConfiguratorStorefrontUtilsService);
  });

  it('should be created', () => {
    expect(classUnderTest).toBeTruthy();
  });

  function getCurrentResult() {
    let result: boolean;
    classUnderTest
      .isCartEntryOrGroupVisited(owner, 'group_01')
      .subscribe((data) => (result = data))
      .unsubscribe();
    return result;
  }

  it('should scroll to element', () => {
    const theElement = document.createElement('div');
    document.querySelector = jasmine
      .createSpy('HTML Element')
      .and.returnValue(theElement);
    spyOn(theElement, 'getBoundingClientRect').and.returnValue(
      new DOMRect(100, 2000, 100, 100)
    );
    spyOn(window, 'scroll').and.callThrough();
    classUnderTest.scrollToConfigurationElement(
      '.VariantConfigurationTemplate'
    );
    expect(window.scroll).toHaveBeenCalledWith(0, 0);
  });

  it('should return false because the product has not been added to the cart and the current group was not visited', () => {
    isGroupVisited = of(false);
    owner.type = CommonConfigurator.OwnerType.PRODUCT;
    expect(getCurrentResult()).toBe(false);
  });

  it('should return true because the product has been added to the cart', () => {
    isGroupVisited = of(false);
    owner.type = CommonConfigurator.OwnerType.CART_ENTRY;
    expect(getCurrentResult()).toBe(true);
  });

  it('should return true because the current group was visited', () => {
    isGroupVisited = of(true);
    expect(getCurrentResult()).toBe(true);
  });

  it('should assemble values from a checkbox list into an attribute value', () => {
    const controlArray = new Array<FormControl>();
    const control1 = new FormControl(true);
    const control2 = new FormControl(false);
    controlArray.push(control1, control2);
    const attribute: Configurator.Attribute = {
      name: 'attr',
      values: [{ valueCode: 'b' }, { name: 'blue' }],
    };

    const values: Configurator.Value[] = classUnderTest.assembleValuesForMultiSelectAttributes(
      controlArray,
      attribute
    );
    expect(values.length).toBe(2);
    expect(values[0].valueCode).toBe(attribute.values[0].valueCode);
    expect(values[0].selected).toBe(true);
    expect(values[1].name).toBe(attribute.values[1].name);
    expect(values[1].selected).toBe(false);
  });
});
