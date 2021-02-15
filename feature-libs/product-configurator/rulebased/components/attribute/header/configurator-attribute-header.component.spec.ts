import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { I18nTestingModule } from '@spartacus/core';
import { CommonConfigurator } from '@spartacus/product-configurator/common';
import {
  IconLoaderService,
  IconModule,
  ICON_TYPE,
} from '@spartacus/storefront';
import { Observable, of } from 'rxjs';
import { CommonConfiguratorTestUtilsService } from '../../../../common/shared/testing/common-configurator-test-utils.service';
import { Configurator } from '../../../core/model/configurator.model';
import { ConfiguratorStorefrontUtilsService } from '../../service/configurator-storefront-utils.service';
import { ConfiguratorAttributeHeaderComponent } from './configurator-attribute-header.component';

export class MockIconFontLoaderService {
  useSvg(_iconType: ICON_TYPE) {
    return false;
  }
  getStyleClasses(_iconType: ICON_TYPE): string {
    return 'fas fa-exclamation-circle';
  }
  addLinkResource() {}
  getHtml(_iconType: ICON_TYPE) {}
  getFlipDirection(): void {}
}

let isCartEntryOrGroupVisited = true;
class MockConfigUtilsService {
  isCartEntryOrGroupVisited(): Observable<boolean> {
    return of(isCartEntryOrGroupVisited);
  }
}

describe('ConfigAttributeHeaderComponent', () => {
  let classUnderTest: ConfiguratorAttributeHeaderComponent;
  let fixture: ComponentFixture<ConfiguratorAttributeHeaderComponent>;

  const owner: CommonConfigurator.Owner = {
    id: 'PRODUCT_CODE',
    type: CommonConfigurator.OwnerType.CART_ENTRY,
  };

  const currentAttribute: Configurator.Attribute = {
    name: 'attributeId',
    uiType: Configurator.UiType.RADIOBUTTON,
    images: [
      {
        url: 'someImageURL',
      },
    ],
  };
  let htmlElem: HTMLElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [I18nTestingModule, IconModule],
        declarations: [ConfiguratorAttributeHeaderComponent],
        providers: [
          { provide: IconLoaderService, useClass: MockIconFontLoaderService },
          {
            provide: ConfiguratorStorefrontUtilsService,
            useClass: MockConfigUtilsService,
          },
        ],
      })
        .overrideComponent(ConfiguratorAttributeHeaderComponent, {
          set: {
            changeDetection: ChangeDetectionStrategy.Default,
          },
        })
        .compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguratorAttributeHeaderComponent);
    classUnderTest = fixture.componentInstance;
    htmlElem = fixture.nativeElement;
    classUnderTest.attribute = currentAttribute;
    classUnderTest.attribute.label = 'label of attribute';
    classUnderTest.attribute.name = '123';
    classUnderTest.owner = owner;
    classUnderTest.groupId = 'testGroup';
    classUnderTest.attribute.required = false;
    classUnderTest.attribute.incomplete = true;
    classUnderTest.attribute.uiType = Configurator.UiType.RADIOBUTTON;
    classUnderTest.groupType = Configurator.GroupType.ATTRIBUTE_GROUP;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(classUnderTest).toBeTruthy();
  });

  describe('Render corresponding part of the component', () => {
    it('should render a label', () => {
      CommonConfiguratorTestUtilsService.expectElementPresent(
        expect,
        htmlElem,
        'label'
      );
      CommonConfiguratorTestUtilsService.expectElementToContainText(
        expect,
        htmlElem,
        'label',
        'label of attribute'
      );
      const id = htmlElem.querySelector('label').getAttribute('id');
      expect(id.indexOf('123')).toBeGreaterThan(
        0,
        'id of label does not contain the StdAttrCode'
      );
      expect(
        htmlElem.querySelector('label').getAttribute('aria-label')
      ).toEqual(classUnderTest.attribute.label);
      CommonConfiguratorTestUtilsService.expectElementNotPresent(
        expect,
        htmlElem,
        '.cx-required-icon'
      );
    });

    it('should render a label as required', () => {
      classUnderTest.attribute.required = true;
      fixture.detectChanges();
      CommonConfiguratorTestUtilsService.expectElementPresent(
        expect,
        htmlElem,
        '.cx-required-icon'
      );
    });

    it('should render an image', () => {
      CommonConfiguratorTestUtilsService.expectElementPresent(
        expect,
        htmlElem,
        '.cx-attribute-img'
      );
    });
  });

  describe('Get required message key', () => {
    it('should return a single-select message key for radio button attribute type', () => {
      expect(classUnderTest.getRequiredMessageKey()).toContain(
        'singleSelectRequiredMessage'
      );
    });

    it('should return a single-select message key for ddlb attribute type', () => {
      classUnderTest.attribute.uiType = Configurator.UiType.DROPDOWN;
      expect(classUnderTest.getRequiredMessageKey()).toContain(
        'singleSelectRequiredMessage'
      );
    });

    it('should return a single-select message key for single-selection-image attribute type', () => {
      classUnderTest.attribute.uiType =
        Configurator.UiType.SINGLE_SELECTION_IMAGE;
      expect(classUnderTest.getRequiredMessageKey()).toContain(
        'singleSelectRequiredMessage'
      );
    });

    it('should return a multi-select message key for check box list attribute type', () => {
      classUnderTest.attribute.uiType = Configurator.UiType.CHECKBOXLIST;
      expect(classUnderTest.getRequiredMessageKey()).toContain(
        'multiSelectRequiredMessage'
      );
    });

    it('should return a multi-select message key for multi-selection-image list attribute type', () => {
      classUnderTest.attribute.uiType =
        Configurator.UiType.MULTI_SELECTION_IMAGE;
      expect(classUnderTest.getRequiredMessageKey()).toContain(
        'multiSelectRequiredMessage'
      );
    });

    it('should return no key for not implemented attribute type', () => {
      classUnderTest.attribute.uiType = Configurator.UiType.NOT_IMPLEMENTED;
      expect(classUnderTest.getRequiredMessageKey()).toContain(
        'singleSelectRequiredMessage'
      );
    });

    it('should return no key for read only attribute type', () => {
      classUnderTest.attribute.uiType = Configurator.UiType.READ_ONLY;
      expect(classUnderTest.getRequiredMessageKey()).toContain(
        'singleSelectRequiredMessage'
      );
    });
  });

  describe('Required message at the attribute level', () => {
    it('should render a required message if attribute has been set, yet.', () => {
      classUnderTest.attribute.required = true;
      classUnderTest.attribute.uiType = Configurator.UiType.RADIOBUTTON;
      classUnderTest.ngOnInit();
      fixture.detectChanges();
      CommonConfiguratorTestUtilsService.expectElementPresent(
        expect,
        htmlElem,
        '.cx-required-error-msg'
      );
    });

    it('should render a required message if the group has already been visited.', () => {
      classUnderTest.owner.type = CommonConfigurator.OwnerType.PRODUCT;
      isCartEntryOrGroupVisited = true;
      fixture.detectChanges();
      CommonConfiguratorTestUtilsService.expectElementNotPresent(
        expect,
        htmlElem,
        '.cx-required-error-msg'
      );
    });

    it("shouldn't render a required message if attribute has not been added to the cart yet.", () => {
      classUnderTest.owner.type = CommonConfigurator.OwnerType.PRODUCT;
      fixture.detectChanges();
      CommonConfiguratorTestUtilsService.expectElementNotPresent(
        expect,
        htmlElem,
        '.cx-required-error-msg'
      );
    });

    it("shouldn't render a required message if attribute is not required.", () => {
      classUnderTest.attribute.required = false;
      fixture.detectChanges();
      CommonConfiguratorTestUtilsService.expectElementNotPresent(
        expect,
        htmlElem,
        '.cx-required-error-msg'
      );
    });

    it("shouldn't render a required message if attribute is complete.", () => {
      classUnderTest.attribute.incomplete = true;
      fixture.detectChanges();
      CommonConfiguratorTestUtilsService.expectElementNotPresent(
        expect,
        htmlElem,
        '.cx-required-error-msg'
      );
    });

    it("shouldn't render a required message if ui type is string.", () => {
      classUnderTest.attribute.uiType = Configurator.UiType.STRING;
      fixture.detectChanges();
      CommonConfiguratorTestUtilsService.expectElementNotPresent(
        expect,
        htmlElem,
        '.cx-required-error-msg'
      );
    });
  });

  describe('Conflict text at the attribute level', () => {
    it('should render conflict icon with corresponding message if attribute has conflicts.', () => {
      classUnderTest.attribute.hasConflicts = true;
      classUnderTest.groupType = Configurator.GroupType.ATTRIBUTE_GROUP;
      fixture.detectChanges();

      CommonConfiguratorTestUtilsService.expectElementPresent(
        expect,
        htmlElem,
        '.cx-conflict-msg'
      );

      CommonConfiguratorTestUtilsService.expectElementPresent(
        expect,
        htmlElem,
        'cx-icon'
      );
    });

    it('should render conflict message without icon container if conflict message is not displayed in the configuration.', () => {
      classUnderTest.attribute.hasConflicts = true;
      classUnderTest.groupType = Configurator.GroupType.CONFLICT_GROUP;
      fixture.detectChanges();

      CommonConfiguratorTestUtilsService.expectElementPresent(
        expect,
        htmlElem,
        '.cx-conflict-msg'
      );

      CommonConfiguratorTestUtilsService.expectElementNotPresent(
        expect,
        htmlElem,
        'cx-icon'
      );
    });

    it("shouldn't render conflict message if attribute has no conflicts.", () => {
      classUnderTest.attribute.hasConflicts = false;
      fixture.detectChanges();

      CommonConfiguratorTestUtilsService.expectElementNotPresent(
        expect,
        htmlElem,
        '.cx-conflict-container'
      );
    });
  });

  describe('Verify attribute type', () => {
    it("should return 'true'", () => {
      classUnderTest.groupType = Configurator.GroupType.ATTRIBUTE_GROUP;
      fixture.detectChanges();
      expect(classUnderTest.isAttributeGroup(classUnderTest.groupType)).toBe(
        true
      );
    });

    it("should return 'false'", () => {
      classUnderTest.groupType = Configurator.GroupType.CONFLICT_GROUP;
      fixture.detectChanges();
      expect(classUnderTest.isAttributeGroup(classUnderTest.groupType)).toBe(
        false
      );
    });
  });

  describe('Get conflict message key', () => {
    it("should return 'configurator.conflict.viewConflictDetails' conflict message key", () => {
      classUnderTest.groupType = Configurator.GroupType.ATTRIBUTE_GROUP;
      fixture.detectChanges();
      expect(
        classUnderTest.getConflictMessageKey(classUnderTest.groupType)
      ).toEqual('configurator.conflict.viewConflictDetails');
    });

    it("should return 'configurator.conflict.viewConfigurationDetails' conflict message key", () => {
      classUnderTest.groupType = Configurator.GroupType.CONFLICT_GROUP;
      fixture.detectChanges();
      expect(
        classUnderTest.getConflictMessageKey(classUnderTest.groupType)
      ).toEqual('configurator.conflict.viewConfigurationDetails');
    });
  });
});
