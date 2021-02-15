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
import { RolesCellComponent } from '../shared/table/roles/roles-cell.component';
import { StatusCellComponent } from '../shared/table/status/status-cell.component';
import { UnitCellComponent } from '../shared/table/unit/unit-cell.component';
import { OrganizationTableType } from '../shared/organization.model';
import { UserAssignedApproverListComponent } from './approvers/assigned/user-assigned-approver-list.component';
import { UserApproverListComponent } from './approvers/user-approver-list.component';
import { UserChangePasswordFormComponent } from './change-password-form/user-change-password-form.component';
import { UserDetailsComponent } from './details/user-details.component';
import { UserFormComponent } from './form/user-form.component';
import { UserAssignedPermissionListComponent } from './permissions/assigned/user-assigned-permission-list.component';
import { UserPermissionListComponent } from './permissions/user-permission-list.component';
import { UserItemService } from './services/user-item.service';
import { UserListService } from './services/user-list.service';
import { UserRoutePageMetaResolver } from './services/user-route-page-meta.resolver';
import { UserUserGroupListComponent } from './user-groups';
import { UserAssignedUserGroupListComponent } from './user-groups/assigned/user-assigned-user-group-list.component';

const listPath = `organization/users/:${ROUTE_PARAMS.userCode}`;
const paramsMapping: ParamsMapping = {
  userCode: 'customerId',
};

export const userRoutingConfig: RoutingConfig = {
  routing: {
    routes: {
      orgUser: {
        paths: ['organization/users'],
      },
      orgUserCreate: {
        paths: ['organization/users/create'],
      },
      orgUserDetails: {
        paths: [listPath],
        paramsMapping,
      },
      orgUserEdit: {
        paths: [`${listPath}/edit`],
        paramsMapping,
      },
      orgUserChangePassword: {
        paths: [`${listPath}/change-password`],
        paramsMapping,
      },
      orgUserApprovers: {
        paths: [`${listPath}/approvers`],
        paramsMapping,
      },
      orgUserAssignApprovers: {
        paths: [`${listPath}/approvers/assign`],
        paramsMapping,
      },
      orgUserPermissions: {
        paths: [`${listPath}/purchase-limits`],
        paramsMapping,
      },
      orgUserAssignPermissions: {
        paths: [`${listPath}/purchase-limits/assign`],
        paramsMapping,
      },
      orgUserUserGroups: {
        paths: [`${listPath}/user-groups`],
        paramsMapping,
      },
      orgUserAssignUserGroups: {
        paths: [`${listPath}/user-groups/assign`],
        paramsMapping,
      },
    },
  },
};

export const userCmsConfig: CmsConfig = {
  cmsComponents: {
    ManageUsersListComponent: {
      component: ListComponent,
      providers: [
        {
          provide: ListService,
          useExisting: UserListService,
        },
        {
          provide: ItemService,
          useExisting: UserItemService,
        },
      ],
      childRoutes: {
        parent: {
          data: {
            cxPageMeta: {
              breadcrumb: 'orgUser.breadcrumbs.list',
              resolver: UserRoutePageMetaResolver,
            },
          },
        },
        children: [
          {
            path: 'create',
            component: UserFormComponent,
          },
          {
            path: `:${ROUTE_PARAMS.userCode}`,
            component: UserDetailsComponent,
            data: {
              cxPageMeta: { breadcrumb: 'orgUser.breadcrumbs.details' },
            },
            children: [
              {
                path: `edit`,
                component: UserFormComponent,
              },
              {
                path: `change-password`,
                component: UserChangePasswordFormComponent,
              },
              {
                path: 'user-groups',
                data: {
                  cxPageMeta: { breadcrumb: 'orgUser.breadcrumbs.userGroups' },
                },
                children: [
                  {
                    path: '',
                    component: UserAssignedUserGroupListComponent,
                  },
                  {
                    path: 'assign',
                    component: UserUserGroupListComponent,
                  },
                ],
              },
              {
                path: 'approvers',
                data: {
                  cxPageMeta: { breadcrumb: 'orgUser.breadcrumbs.approvers' },
                },
                children: [
                  {
                    path: '',
                    component: UserAssignedApproverListComponent,
                  },
                  {
                    path: 'assign',
                    component: UserApproverListComponent,
                  },
                ],
              },
              {
                path: 'purchase-limits',
                data: {
                  cxPageMeta: { breadcrumb: 'orgUser.breadcrumbs.permissions' },
                },
                children: [
                  {
                    path: '',
                    component: UserAssignedPermissionListComponent,
                  },
                  {
                    path: 'assign',
                    component: UserPermissionListComponent,
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

export function userTableConfigFactory(): TableConfig {
  return userTableConfig;
}

const cells = {
  actions: {
    dataComponent: AssignCellComponent,
  },
};
const pagination = {
  pageSize: MAX_OCC_INTEGER_VALUE,
};

export const userTableConfig: TableConfig = {
  table: {
    [OrganizationTableType.USER]: {
      cells: ['name', 'active', 'uid', 'roles', 'unit'],
      options: {
        cells: {
          name: {
            dataComponent: ActiveLinkCellComponent,
          },
          active: {
            dataComponent: StatusCellComponent,
          },
          uid: {
            dataComponent: CellComponent,
          },
          roles: {
            dataComponent: RolesCellComponent,
          },
          unit: {
            dataComponent: UnitCellComponent,
          },
        },
      },
    },
    [OrganizationTableType.USER_APPROVERS]: {
      cells: ['name', 'actions'],
      options: {
        cells,
      },
    },
    [OrganizationTableType.USER_ASSIGNED_APPROVERS]: {
      cells: ['name', 'actions'],
      options: {
        cells,
        pagination,
      },
    },
    [OrganizationTableType.USER_USER_GROUPS]: {
      cells: ['uid', 'actions'],
      options: {
        cells,
      },
    },
    [OrganizationTableType.USER_ASSIGNED_USER_GROUPS]: {
      cells: ['uid', 'actions'],
      options: {
        cells,
        pagination,
      },
    },
    [OrganizationTableType.USER_PERMISSIONS]: {
      cells: ['code', 'actions'],
      options: {
        cells,
      },
    },
    [OrganizationTableType.USER_ASSIGNED_PERMISSIONS]: {
      cells: ['code', 'actions'],
      options: {
        cells,
        pagination,
      },
    },
  },
};
