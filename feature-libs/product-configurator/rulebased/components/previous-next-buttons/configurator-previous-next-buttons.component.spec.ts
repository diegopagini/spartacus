import { ChangeDetectionStrategy, Directive, Input, Type } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  I18nTestingModule,
  RouterState,
  RoutingService,
} from '@spartacus/core';
import {
  CommonConfigurator,
  CommonConfiguratorUtilsService,
} from '@spartacus/product-configurator/common';
import { cold } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { ConfiguratorCommonsService } from '../../core/facade/configurator-commons.service';
import { ConfiguratorGroupsService } from '../../core/facade/configurator-groups.service';
import { Configurator } from '../../core/model/configurator.model';
import * as ConfigurationTestData from '../../shared/testing/configurator-test-data';
import {
  GROUP_ID_1,
  PRODUCT_CODE,
} from '../../shared/testing/configurator-test-data';
import { ConfiguratorStorefrontUtilsService } from '../service/configurator-storefront-utils.service';
import { ConfiguratorPreviousNextButtonsComponent } from './configurator-previous-next-buttons.component';

let routerStateObservable = null;

class MockRoutingService {
  getRouterState(): Observable<RouterState> {
    return routerStateObservable;
  }
}

class MockConfiguratorGroupsService {
  getCurrentGroupId() {
    return of('');
  }
  getNextGroupId() {
    return of('');
  }
  getPreviousGroupId() {
    return of('');
  }
  navigateToGroup() {}
}

const groups: Configurator.Group = {
  id: GROUP_ID_1,
  groupType: Configurator.GroupType.ATTRIBUTE_GROUP,
  attributes: [],
  subGroups: [],
};

const configWithoutGroups: Configurator.Configuration = {
  configId: 'CONFIG_ID',
  productCode: PRODUCT_CODE,
  totalNumberOfIssues: 0,
  owner: {
    id: PRODUCT_CODE,
    type: CommonConfigurator.OwnerType.PRODUCT,
  },
  groups: [groups],
  flatGroups: [groups],
};

const config: Configurator.Configuration =
  ConfigurationTestData.productConfiguration;

class MockConfiguratorCommonsService {
  getConfiguration(): Observable<Configurator.Configuration> {
    return of(config);
  }
}

class MockConfigUtilsService {
  scrollToConfigurationElement(): void {}
}

@Directive({
  selector: '[cxFocus]',
})
export class MockFocusDirective {
  @Input('cxFocus') protected config;
}

describe('ConfigPreviousNextButtonsComponent', () => {
  let classUnderTest: ConfiguratorPreviousNextButtonsComponent;
  let fixture: ComponentFixture<ConfiguratorPreviousNextButtonsComponent>;
  let configuratorCommonsService: ConfiguratorCommonsService;
  let configurationGroupsService: ConfiguratorGroupsService;
  let configuratorUtils: CommonConfiguratorUtilsService;

  beforeEach(
    waitForAsync(() => {
      routerStateObservable = of(ConfigurationTestData.mockRouterState);
      TestBed.configureTestingModule({
        imports: [I18nTestingModule],
        declarations: [
          ConfiguratorPreviousNextButtonsComponent,
          MockFocusDirective,
        ],
        providers: [
          {
            provide: RoutingService,
            useClass: MockRoutingService,
          },
          {
            provide: ConfiguratorGroupsService,
            useClass: MockConfiguratorGroupsService,
          },
          {
            provide: ConfiguratorCommonsService,
            useClass: MockConfiguratorCommonsService,
          },
          {
            provide: ConfiguratorStorefrontUtilsService,
            useClass: MockConfigUtilsService,
          },
        ],
      })
        .overrideComponent(ConfiguratorPreviousNextButtonsComponent, {
          set: {
            changeDetection: ChangeDetectionStrategy.Default,
          },
        })
        .compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguratorPreviousNextButtonsComponent);
    classUnderTest = fixture.componentInstance;
    configuratorCommonsService = TestBed.inject(
      ConfiguratorCommonsService as Type<ConfiguratorCommonsService>
    );
    configurationGroupsService = TestBed.inject(
      ConfiguratorGroupsService as Type<ConfiguratorGroupsService>
    );
    fixture.detectChanges();
    configuratorUtils = TestBed.inject(
      CommonConfiguratorUtilsService as Type<CommonConfiguratorUtilsService>
    );
    configuratorUtils.setOwnerKey(config.owner);
  });

  it('should create', () => {
    expect(classUnderTest).toBeTruthy();
  });

  it("should not display 'previous' & 'next' buttons", () => {
    spyOn(configuratorCommonsService, 'getConfiguration').and.returnValue(
      of(configWithoutGroups)
    );
    fixture = TestBed.createComponent(ConfiguratorPreviousNextButtonsComponent);
    classUnderTest = fixture.componentInstance;
    fixture.detectChanges();
    expect(fixture.nativeElement.childElementCount).toBe(0);
  });

  it('should display previous button as disabled if it is the first group', () => {
    spyOn(configurationGroupsService, 'getPreviousGroupId').and.returnValue(
      of(null)
    );
    fixture.detectChanges();
    const prevBtn = fixture.debugElement.query(By.css('.btn-action'))
      .nativeElement;
    expect(prevBtn.disabled).toBe(true);
  });

  it('should display previous button as enabled if it is not the first group', () => {
    spyOn(configurationGroupsService, 'getPreviousGroupId').and.returnValue(
      of('anyGroupId')
    );
    fixture.detectChanges();
    const prevBtn = fixture.debugElement.query(By.css('.btn-action'))
      .nativeElement;
    expect(prevBtn.disabled).toBe(false);
  });

  it('should display next button as disabled if it is the last group', () => {
    spyOn(configurationGroupsService, 'getNextGroupId').and.returnValue(
      of(null)
    );
    fixture.detectChanges();
    const lastBtn = fixture.debugElement.query(By.css('.btn-secondary'))
      .nativeElement;
    expect(lastBtn.disabled).toBe(true);
  });

  it('should display next button as enabled if it is not the last group', () => {
    spyOn(configurationGroupsService, 'getNextGroupId').and.returnValue(
      of('anyGroupId')
    );
    fixture.detectChanges();
    const prevBtn = fixture.debugElement.query(By.css('.btn-secondary'))
      .nativeElement;
    expect(prevBtn.disabled).toBe(false);
  });

  it('should derive that current group is last group depending on group service nextGroup function', () => {
    const nextGroup = cold('-a-b-c', {
      a: ConfigurationTestData.GROUP_ID_1,
      b: ConfigurationTestData.GROUP_ID_2,
      c: null,
    });

    spyOn(configurationGroupsService, 'getNextGroupId').and.returnValue(
      nextGroup
    );

    expect(classUnderTest.isLastGroup(config.owner)).toBeObservable(
      cold('-a-b-c', {
        a: false,
        b: false,
        c: true,
      })
    );
  });

  it('should derive that current group is first group depending on group service getPreviousGroup function', () => {
    const previousGroup = cold('-a-b-c-d-e', {
      a: null,
      b: ConfigurationTestData.GROUP_ID_2,
      c: null,
      d: '',
      e: ' ',
    });

    spyOn(configurationGroupsService, 'getPreviousGroupId').and.returnValue(
      previousGroup
    );

    expect(classUnderTest.isFirstGroup(config.owner)).toBeObservable(
      cold('-a-b-c-d-e', {
        a: true,
        b: false,
        c: true,
        d: true,
        e: false,
      })
    );
  });

  it('should navigate to group exactly one time on navigateToPreviousGroup', () => {
    //usage of TestScheduler because of the async check in last line
    const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    testScheduler.run((helpers) => {
      const { expectObservable } = helpers;
      const previousGroup = cold('-a-b', {
        a: ConfigurationTestData.GROUP_ID_1,
        b: ConfigurationTestData.GROUP_ID_2,
      });
      //this just validates the testScheduler
      expectObservable(previousGroup.pipe(take(1))).toBe('-(a|)', {
        a: ConfigurationTestData.GROUP_ID_1,
      });

      spyOn(configurationGroupsService, 'getPreviousGroupId').and.returnValue(
        previousGroup
      );
      spyOn(configurationGroupsService, 'navigateToGroup');

      classUnderTest.onPrevious(config);
    });
    //this is the actual test
    expect(configurationGroupsService.navigateToGroup).toHaveBeenCalledTimes(1);
  });

  it('should navigate to group exactly one time on navigateToNextGroup', () => {
    //usage of TestScheduler because of the async check in last line
    const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    testScheduler.run(() => {
      const nextGroup = cold('-a-b', {
        a: ConfigurationTestData.GROUP_ID_1,
        b: ConfigurationTestData.GROUP_ID_2,
      });

      spyOn(configurationGroupsService, 'getNextGroupId').and.returnValue(
        nextGroup
      );
      spyOn(configurationGroupsService, 'navigateToGroup');

      classUnderTest.onNext(config);
    });

    expect(configurationGroupsService.navigateToGroup).toHaveBeenCalledTimes(1);
  });
});
