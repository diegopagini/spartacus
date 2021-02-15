import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { CmsService, Page, PageRobotsMeta } from '../../cms';
import { BasePageMetaResolver } from '../../cms/page/base-page-meta.resolver';
import { I18nTestingModule } from '../../i18n';
import { PageType } from '../../model/cms.model';
import { RoutingService } from '../../routing';
import { ProductSearchService } from '../facade';
import { SearchPageMetaResolver } from './search-page-meta.resolver';

const mockSearchPage: Page = {
  type: PageType.CONTENT_PAGE,
  template: 'SearchResultsListPageTemplate',
  slots: {},
};

class MockCmsService {
  getCurrentPage(): Observable<Page> {
    return of(mockSearchPage);
  }
}

class MockProductSearchService {
  getResults() {
    return of({
      pagination: {
        totalResults: 3,
      },
    });
  }
}

class MockRoutingService {
  getRouterState() {
    return of({
      state: {
        params: {
          query: 'Canon',
        },
      },
    });
  }
}
class MockBasePageMetaResolver {
  resolveRobots() {
    return of([]);
  }
}

describe('SearchPageMetaResolver', () => {
  let resolver: SearchPageMetaResolver;
  let basePageMetaResolver: BasePageMetaResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      providers: [
        SearchPageMetaResolver,
        { provide: CmsService, useClass: MockCmsService },
        { provide: ProductSearchService, useClass: MockProductSearchService },
        { provide: RoutingService, useClass: MockRoutingService },
        {
          provide: BasePageMetaResolver,
          useClass: MockBasePageMetaResolver,
        },
      ],
    });

    resolver = TestBed.inject(SearchPageMetaResolver);
    basePageMetaResolver = TestBed.inject(BasePageMetaResolver);
  });

  it('PageTitleService should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve title', () => {
    let result: string;
    resolver
      .resolveTitle()
      .subscribe((value) => {
        result = value;
      })
      .unsubscribe();

    expect(result).toEqual('pageMetaResolver.search.title count:3 query:Canon');
  });

  describe('resolveRobots', () => {
    it('should resolve title from the BasePageMetaResolver', async () => {
      spyOn(basePageMetaResolver, 'resolveRobots').and.returnValue(
        of([PageRobotsMeta.FOLLOW, PageRobotsMeta.INDEX])
      );
      let result;
      resolver
        .resolveRobots()
        .subscribe((robots) => (result = robots))
        .unsubscribe();
      expect(result).toContain(PageRobotsMeta.FOLLOW);
      expect(result).toContain(PageRobotsMeta.INDEX);
    });
  });
});
