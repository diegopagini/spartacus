import {
  AuthGuard,
  CmsConfig,
  ParamsMapping,
  RoutingConfig,
} from '@spartacus/core';
import { AdminGuard } from '@spartacus/organization/administration/core';
import { TableConfig } from '@spartacus/storefront';
import { MAX_OCC_INTEGER_VALUE, ROUTE_PARAMS } from '../constants';
import { ItemService } from '../shared/item.service';
import { ListComponent } from '../shared/list/list.component';
import { ListService } from '../shared/list/list.service';
import { AssignCellComponent } from '../shared/sub-list/assign-cell.component';
import { ActiveLinkCellComponent } from '../shared/table/active-link/active-link-cell.component';
import { CellComponent } from '../shared/table/cell.component';
import { UnitCellComponent } from '../shared/table/unit/unit-cell.component';
import { OrganizationTableType } from '../shared/organization.model';
import { UserGroupDetailsComponent } from './details/user-group-details.component';
import { UserGroupFormComponent } from './form/user-group-form.component';
import { UserGroupAssignedPermissionListComponent } from './permissions/assigned/user-group-assigned-permission-list.component';
import { UserGroupPermissionListComponent } from './permissions/user-group-permission-list.component';
import { UserGroupItemService } from './services/user-group-item.service';
import { UserGroupListService } from './services/user-group-list.service';
import { UserGroupRoutePageMetaResolver } from './services/user-group-route-page-meta.resolver';
import { UserGroupAssignedUserListComponent } from './users/assigned/user-group-assigned-user-list.component';
import { UserGroupUserListComponent } from './users/user-group-user-list.component';

const listPath = `organization/user-groups/:${ROUTE_PARAMS.userGroupCode}`;
const paramsMapping: ParamsMapping = {
  userGroupCode: 'uid',
};

// TODO: this doesn't work with lazy loaded feature
export const userGroupRoutingConfig: RoutingConfig = {
  routing: {
    routes: {
      orgUserGroup: {
        paths: ['organization/user-groups'],
      },
      orgUserGroupCreate: {
        paths: ['organization/user-groups/create'],
      },
      orgUserGroupDetails: {
        paths: [listPath],
        paramsMapping,
      },
      orgUserGroupEdit: {
        paths: [`${listPath}/edit`],
        paramsMapping,
      },
      orgUserGroupUsers: {
        paths: [`${listPath}/users`],
        paramsMapping,
      },
      orgUserGroupAssignUsers: {
        paths: [`${listPath}/users/assign`],
        paramsMapping,
      },
      orgUserGroupPermissions: {
        paths: [`${listPath}/purchase-limits`],
        paramsMapping,
      },
      orgUserGroupAssignPermissions: {
        paths: [`${listPath}/purchase-limits/assign`],
        paramsMapping,
      },
    },
  },
};

export const userGroupCmsConfig: CmsConfig = {
  cmsComponents: {
    ManageUserGroupsListComponent: {
      component: ListComponent,
      providers: [
        {
          provide: ListService,
          useExisting: UserGroupListService,
        },
        {
          provide: ItemService,
          useExisting: UserGroupItemService,
        },
      ],
      childRoutes: {
        parent: {
          data: {
            cxPageMeta: {
              breadcrumb: 'orgUserGroup.breadcrumbs.list',
              resolver: UserGroupRoutePageMetaResolver,
            },
          },
        },
        children: [
          {
            path: 'create',
            component: UserGroupFormComponent,
          },
          {
            path: `:${ROUTE_PARAMS.userGroupCode}`,
            component: UserGroupDetailsComponent,
            data: {
              cxPageMeta: { breadcrumb: 'orgUserGroup.breadcrumbs.details' },
            },
            children: [
              {
                path: 'edit',
                component: UserGroupFormComponent,
              },
              {
                path: 'users',
                data: {
                  cxPageMeta: { breadcrumb: 'orgUserGroup.breadcrumbs.users' },
                },
                children: [
                  {
                    path: '',
                    component: UserGroupAssignedUserListComponent,
                  },
                  {
                    path: 'assign',
                    component: UserGroupUserListComponent,
                  },
                ],
              },
              {
                path: 'purchase-limits',
                data: {
                  cxPageMeta: {
                    breadcrumb: 'orgUserGroup.breadcrumbs.permissions',
                  },
                },
                children: [
                  {
                    path: '',
                    component: UserGroupAssignedPermissionListComponent,
                  },
                  {
                    path: 'assign',
                    component: UserGroupPermissionListComponent,
                  },
                ],
              },
            ],
          },
        ],
      },
      guards: [AuthGuard, AdminGuard],
    },
  },
};

export function userGroupTableConfigFactory(): TableConfig {
  return userGroupTableConfig;
}

export const userGroupTableConfig: TableConfig = {
  table: {
    [OrganizationTableType.USER_GROUP]: {
      cells: ['name', 'uid', 'unit'],
      options: {
        dataComponent: CellComponent,
        cells: {
          name: {
            dataComponent: ActiveLinkCellComponent,
          },
          uid: {
            dataComponent: CellComponent,
          },
          unit: {
            dataComponent: UnitCellComponent,
          },
        },
      },
    },
    [OrganizationTableType.USER_GROUP_ASSIGNED_USERS]: {
      cells: ['name', 'actions'],
      options: {
        cells: {
          actions: {
            dataComponent: AssignCellComponent,
          },
        },
        pagination: {
          pageSize: MAX_OCC_INTEGER_VALUE,
        },
      },
    },

    [OrganizationTableType.USER_GROUP_USERS]: {
      cells: ['name', 'actions'],
      options: {
        cells: {
          actions: {
            dataComponent: AssignCellComponent,
          },
        },
      },
    },
    [OrganizationTableType.USER_GROUP_PERMISSIONS]: {
      cells: ['code', 'actions'],
      options: {
        cells: {
          actions: {
            dataComponent: AssignCellComponent,
          },
        },
      },
    },
    [OrganizationTableType.USER_GROUP_ASSIGNED_PERMISSIONS]: {
      cells: ['code', 'actions'],
      options: {
        cells: {
          actions: {
            dataComponent: AssignCellComponent,
          },
        },
        pagination: {
          pageSize: MAX_OCC_INTEGER_VALUE,
        },
      },
    },
  },
};
