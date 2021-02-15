export const orgUnit = {
  header: 'All units ({{count}})',
  unit: 'Unit',
  name: 'Name',
  uid: 'ID',
  approvalProcess: 'Approval process',
  parentUnit: 'Parent Unit',
  active: 'Status',
  details: {
    title: 'Unit Details',
    subtitle: 'Unit: {{ item.name }}',
  },
  edit: {
    title: 'Edit Unit',
    subtitle: 'Unit: {{ item.name }}',
  },
  create: {
    title: 'Create Unit',
    subtitle: '',
  },

  messages: {
    deactivate: 'Are you sure you want to disable this unit?',
    confirmEnabled: 'Unit {{item.name}} enabled successfully',
    confirmDisabled: 'Unit {{item.name}} disabled successfully',
    update: 'Unit {{ item.name }} updated successfully',
    create: 'Unit {{ item.name }} created successfully',
  },

  links: {
    units: 'Child Units',
    users: 'Users',
    approvers: 'Approvers',
    shippingAddresses: 'Shipping Addresses',
    costCenters: 'Cost Centers',
  },

  tree: {
    expandAll: 'Expand all',
    collapseAll: 'Collapse all',
  },

  children: {
    create: {
      title: 'Create child unit',
      subtitle: '',
    },
    messages: {
      create: 'Unit {{ item.name }} created successfully',
    },
  },

  costCenters: {
    create: {
      title: 'Create cost center',
      subtitle: '',
    },
  },

  form: {
    parentOrgUnit: 'Parent business unit',
    create: 'Create Unit',
  },
  users: {
    header: 'Users in {{code}}',
    changeUserRoles: 'Change user roles',
    newUser: 'New user',
  },
  assignRoles: {
    header: 'Manage roles in {{code}}',
    instructions: {
      check: "To assign a role to a user, select the role's check box.",
      uncheck: "To remove a role, clear the role's check box.",
      changes: 'Changes are saved automatically.',
    },
  },
  approvers: {
    header: 'Approvers in {{code}}',
    assign: 'Manage approvers',
    new: 'New approver',
  },
  assignApprovers: {
    header: 'Manage approvers in {{code}}',
    instructions: {
      check: "To assign an approver to this unit, select the user's check box.",
      uncheck: "To remove an approver, clear the user's check box.",
      changes: 'Changes are saved automatically.',
    },
  },

  breadcrumbs: {
    list: 'All units',
    details: '{{name}}',
    children: 'Child units',
    users: 'Users',
    approvers: 'Approvers',
    addresses: 'Shipping addresses',
    addressDetails: '{{formattedAddress}}',
    costCenters: 'Cost Centers',
  },
};

export const orgUnitChildren = {
  title: 'Child units',
  subtitle: 'Unit: {{item.name}}',
};

export const orgUnitAssignedRoles = {
  header: 'Manage roles in {{code}}',
  name: 'Name',
  email: 'Email',
  roles: 'Roles',
  roleCustomer: 'Customer',
  roleApprover: 'Approver',
  roleManager: 'Manager',
  roleAdministrator: 'Admin',
};

export const orgUnitApprovers = {
  title: 'Manage approvers',
  subtitle: 'Unit: {{item.name}}',
  assigned: 'User {{item.name}} assigned successfully',
  unassigned: 'User {{item.name}} unassigned successfully',
};

export const orgUnitAssignedApprovers = {
  title: 'Assigned approvers',
  subtitle: 'Unit: {{item.name}}',
  assigned: 'User {{item.name}} assigned successfully',
  unassigned: 'User {{item.name}} unassigned successfully',
};

export const orgUnitAssignedUsers = {
  title: 'Assigned users',
  subtitle: 'Unit: {{item.name}}',
};

export const orgUnitUsers = {
  title: 'Assigned users',
  subtitle: 'Unit: {{item.name}}',
};

export const orgUnitUserRoles = {
  title: 'User roles',
  subtitle: 'User: {{item.name}}',
  messages: {
    rolesUpdated: 'Roles successfully updated for {{item.name}}',
  },
};

export const orgUnitCostCenters = {
  title: 'Assigned cost centers',
  subtitle: 'Unit: {{item.name}}',
};

export const orgUnitAddress = {
  title: 'Shipping addresses',
  subtitle: 'Unit: {{item.name}}',

  country: 'Country',
  titles: 'Title',
  firstName: 'First name',
  lastName: 'Last name',
  formattedAddress: 'Address',
  address1: 'Address',
  address2: '2nd address (optional)',
  city: 'City',
  state: 'State',
  zipCode: 'Zip code',
  phoneNumber: 'Phone number (optional)',
  streetAddress: 'Street Address',
  aptSuite: 'Apt, Suite',
  selectOne: 'Select One...',

  details: {
    title: 'Address details',
    subtitle: 'Unit: {{item.name}}',
  },
  edit: {
    title: 'Edit Address',
  },
  create: {
    title: 'Create Address',
  },
  form: {
    subtitle: 'Unit: {{item.name}}',
  },
  messages: {
    create:
      'Address {{ item.firstName }} {{ item.lastName }} created successfully',
    update:
      'Address {{ item.firstName }} {{ item.lastName }} updated successfully',
    delete:
      'Are you sure you want to delete address {{ item.firstName }} {{ item.lastName }}?',
    deleted:
      'Address {{ item.firstName }} {{ item.lastName }} deleted successfully',
  },
};
