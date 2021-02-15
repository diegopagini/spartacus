import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  ControlContainer,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  FeaturesConfigModule,
  I18nTestingModule,
  OrderEntry,
} from '@spartacus/core';
import { CartItemContext } from '@spartacus/storefront';
import { ReplaySubject } from 'rxjs';
import { take, toArray } from 'rxjs/operators';
import { ConfiguratorCartEntryInfoComponent } from './configurator-cart-entry-info.component';

class MockCartItemContext implements Partial<CartItemContext> {
  item$ = new ReplaySubject<OrderEntry>(1);
  readonly$ = new ReplaySubject<boolean>(1);
  quantityControl$ = new ReplaySubject<FormControl>(1);
}

describe('ConfiguratorCartEntryInfoComponent', () => {
  let component: ConfiguratorCartEntryInfoComponent;
  let fixture: ComponentFixture<ConfiguratorCartEntryInfoComponent>;
  let mockCartItemContext: MockCartItemContext;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          ReactiveFormsModule,
          I18nTestingModule,
          FeaturesConfigModule,
        ],
        declarations: [ConfiguratorCartEntryInfoComponent],
        providers: [
          { provide: CartItemContext, useClass: MockCartItemContext },
          {
            provide: ControlContainer,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguratorCartEntryInfoComponent);
    component = fixture.componentInstance;
    mockCartItemContext = TestBed.inject(CartItemContext) as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose orderEntry$', (done) => {
    const orderEntry: OrderEntry = { orderCode: '123' };
    component.orderEntry$.pipe(take(1)).subscribe((value) => {
      expect(value).toBe(orderEntry);
      done();
    });

    mockCartItemContext.item$.next(orderEntry);
  });

  it('should expose quantityControl$', (done) => {
    const quantityControl = new FormControl();
    component.quantityControl$.pipe(take(1)).subscribe((value) => {
      expect(value).toBe(quantityControl);
      done();
    });

    mockCartItemContext.quantityControl$.next(quantityControl);
  });

  it('should expose readonly$', (done) => {
    component.readonly$.pipe(take(2), toArray()).subscribe((values) => {
      expect(values).toEqual([true, false]);
      done();
    });

    mockCartItemContext.readonly$.next(true);
    mockCartItemContext.readonly$.next(false);
  });

  describe('configuration infos', () => {
    it('should not be displayed if model provides empty array', () => {
      mockCartItemContext.item$.next({
        statusSummaryList: null,
        configurationInfos: null,
      });
      mockCartItemContext.readonly$.next(false);

      const htmlElem = fixture.nativeElement;
      expect(htmlElem.querySelectorAll('.cx-configuration-info').length).toBe(
        0,
        "expected configuration info identified by selector '.cx-configuration-info' not to be present, but it is! innerHtml: " +
          htmlElem.innerHTML
      );
    });

    it('should be displayed if model provides a success entry', () => {
      mockCartItemContext.item$.next({
        statusSummaryList: null,
        configurationInfos: [
          {
            configurationLabel: 'Color',
            configurationValue: 'Blue',
            configuratorType: 'CPQCONFIGURATOR',
            status: 'SUCCESS',
          },
        ],
      });
      mockCartItemContext.readonly$.next(false);

      fixture.detectChanges();
      const htmlElem = fixture.nativeElement;
      expect(htmlElem.querySelectorAll('.cx-configuration-info').length).toBe(
        1,
        "expected configuration info identified by selector '.cx-configuration-info' to be present, but it is not! innerHtml: " +
          htmlElem.innerHTML
      );
    });

    it('should be displayed if model provides a warning entry', () => {
      mockCartItemContext.item$.next({
        statusSummaryList: null,
        configurationInfos: [
          {
            configurationLabel: 'Pricing',
            configurationValue: 'could not be carried out',
            configuratorType: 'CPQCONFIGURATOR',
            status: 'WARNING',
          },
        ],
      });
      mockCartItemContext.readonly$.next(false);

      fixture.detectChanges();
      const htmlElem = fixture.nativeElement;
      expect(htmlElem.querySelectorAll('.cx-configuration-info').length).toBe(
        1,
        "expected configuration info identified by selector '.cx-configuration-info' to be present, but it is not! innerHtml: " +
          htmlElem.innerHTML
      );
    });

    describe('hasStatus', () => {
      it('should be true if first entry of status summary is in error status', () => {
        const entry: OrderEntry = { configurationInfos: [{ status: 'ERROR' }] };
        expect(component.hasStatus(entry)).toBe(true);
      });

      it('should be false if first entry of status summary carries no status', () => {
        const entry: OrderEntry = { configurationInfos: [{ status: 'NONE' }] };
        expect(component.hasStatus(entry)).toBe(false);
      });
    });
  });
});
