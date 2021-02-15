export enum OrganizationTableType {
  BUDGET = 'orgBudget',
  BUDGET_ASSIGNED_COST_CENTERS = 'orgBudgetAssignedCostCenters',
  COST_CENTER = 'orgCostCenter',
  COST_CENTER_BUDGETS = 'orgCostCenterBudgets',
  COST_CENTER_ASSIGNED_BUDGETS = 'orgCostCenterAssignedBudgets',
  UNIT = 'orgUnit',
  UNIT_USERS = 'orgUnitUsers',
  UNIT_CHILDREN = 'orgUnitChildren',
  UNIT_APPROVERS = 'orgUnitApprovers',
  UNIT_ASSIGNED_APPROVERS = 'orgUnitAssignedApprovers',
  /**
   * @deprecated since 3.0, unused value
   */
  UNIT_ASSIGNED_ROLES = 'orgUnitAssignRoles',
  UNIT_ADDRESS = 'orgUnitAddress',
  UNIT_COST_CENTERS = 'orgUnitCostCenters',
  USER_GROUP = 'orgUserGroup',
  USER_GROUP_USERS = 'orgUserGroupUsers',
  USER_GROUP_ASSIGNED_USERS = 'orgUserGroupAssignedUsers',
  USER_GROUP_PERMISSIONS = 'orgUserGroupPermissions',
  USER_GROUP_ASSIGNED_PERMISSIONS = 'orgUserGroupAssignedPermissions',
  USER = 'orgUser',
  USER_APPROVERS = 'orgUserApprovers',
  USER_ASSIGNED_APPROVERS = 'orgUserAssignedApprovers',
  USER_PERMISSIONS = 'orgUserPermissions',
  USER_ASSIGNED_PERMISSIONS = 'orgUserAssignedPermissions',
  USER_USER_GROUPS = 'orgUserUserGroups',
  USER_ASSIGNED_USER_GROUPS = 'orgUserAssignedUserGroups',
  PERMISSION = 'orgPurchaseLimit',
}

export type BaseItem = {
  code?: string;
  selected?: boolean;
  // tmp alternative "key"
  customerId?: string;
  id?: string;

  active?: boolean;
  orgUnit?: any;
};
