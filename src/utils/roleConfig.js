export const roleConfig = {
  student: {
    menu: ["dashboard", "publications"],
    permissions: {
      canAddPublication: true,
      canManageUsers: false,
      canViewAuditLogs: false,
      canViewMetrics: false,
    },
  },

  faculty: {
    menu: ["dashboard", "publications"],
    permissions: {
      canAddPublication: false,
      canManageUsers: false,
      canViewAuditLogs: false,
      canViewMetrics: true,
    },
  },

  admin: {
    menu: ["dashboard", "users", "publications", "audit_logs", "metrics"],
    permissions: {
      canAddPublication: false,
      canManageUsers: true,
      canViewAuditLogs: true,
      canViewMetrics: true,
    },
  },

  super_admin: {
    menu: ["dashboard", "users", "publications", "audit_logs", "metrics"],
    permissions: {
      canAddPublication: true,
      canManageUsers: true,
      canViewAuditLogs: true,
      canViewMetrics: true,
    },
  },

  finance_department: {
    menu: ["dashboard", "metrics"],
    permissions: {
      canAddPublication: false,
      canManageUsers: false,
      canViewAuditLogs: false,
      canViewMetrics: true,
    },
  },

  university_management: {
    menu: ["dashboard", "publications", "metrics"],
    permissions: {
      canAddPublication: false,
      canManageUsers: false,
      canViewAuditLogs: false,
      canViewMetrics: true,
    },
  },

  director_rd: {
    menu: ["dashboard", "publications", "metrics"],
    permissions: {
      canAddPublication: false,
      canManageUsers: false,
      canViewAuditLogs: true,
      canViewMetrics: true,
    },
  },

  assistant_director_research: {
    menu: ["dashboard", "publications", "audit_logs", "metrics"],
    permissions: {
      canAddPublication: false,
      canManageUsers: false,
      canViewAuditLogs: true,
      canViewMetrics: true,
    },
  },
};