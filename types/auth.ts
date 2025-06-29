export type UserRole = 'subscriber' | 'editor' | 'admin' | 'super_admin';

export interface RoleRequest {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  requestedRole: UserRole;
  currentRole: UserRole;
  reason?: string;
  status: 'pending' | 'approved' | 'denied';
  reviewedBy?: string;
  reviewerName?: string;
  reviewedAt?: string;
  createdAt: string;
  requestedAt?: string; // Alias for createdAt for compatibility
}

export interface RolePermissions {
  canEdit: boolean;
  canManageUsers: boolean;
  canManageContent: boolean;
  canViewPrivate: boolean;
  canDeleteContent: boolean;
}

// Extended User interface for UserManagementDashboard
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  profileImage?: string;
  backgroundImage?: string;
  bio?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  subscriber: {
    canEdit: false,
    canManageUsers: false,
    canManageContent: false,
    canViewPrivate: true, // Subscribers can view private content
    canDeleteContent: false,
  },
  editor: {
    canEdit: true,
    canManageUsers: false,
    canManageContent: true,
    canViewPrivate: true,
    canDeleteContent: false,
  },
  admin: {
    canEdit: true,
    canManageUsers: true,
    canManageContent: true,
    canViewPrivate: true,
    canDeleteContent: true,
  },
  super_admin: {
    canEdit: true,
    canManageUsers: true,
    canManageContent: true,
    canViewPrivate: true,
    canDeleteContent: true,
  },
};

export const ROLE_DISPLAY_INFO: Record<UserRole, { name: string; description: string; color: string }> = {
  subscriber: {
    name: 'Subscriber',
    description: 'Access to all content and community features',
    color: 'blue',
  },
  editor: {
    name: 'Editor',
    description: 'Can create and edit content',
    color: 'green',
  },
  admin: {
    name: 'Admin',
    description: 'Can manage users and all content',
    color: 'orange',
  },
  super_admin: {
    name: 'Super Admin',
    description: 'Full system access and control',
    color: 'red',
  },
};

export const ROLE_HIERARCHY: UserRole[] = ['subscriber', 'editor', 'admin', 'super_admin'];

// Missing exports that RoleRequestModal expects
export const UPGRADEABLE_ROLES: Record<UserRole, UserRole[]> = {
  subscriber: ['editor', 'admin'],
  editor: ['admin'],
  admin: [],
  super_admin: [],
};

export const getRoleHierarchy = (): UserRole[] => {
  return ROLE_HIERARCHY;
};

export const getAvailableRoleUpgrades = (currentRole: UserRole): UserRole[] => {
  const currentIndex = ROLE_HIERARCHY.indexOf(currentRole);
  return ROLE_HIERARCHY.slice(currentIndex + 1);
};

export const canRequestRole = (currentRole: UserRole, requestedRole: UserRole): boolean => {
  const availableUpgrades = getAvailableRoleUpgrades(currentRole);
  return availableUpgrades.includes(requestedRole);
};

// Additional utility functions for role management
export const isHigherRole = (role1: UserRole, role2: UserRole): boolean => {
  const hierarchy = getRoleHierarchy();
  return hierarchy.indexOf(role1) > hierarchy.indexOf(role2);
};

export const getMaxUpgradeRole = (currentRole: UserRole): UserRole | null => {
  const upgrades = getAvailableRoleUpgrades(currentRole);
  return upgrades.length > 0 ? upgrades[upgrades.length - 1] : null;
};

export const getRoleColor = (role: UserRole): string => {
  return ROLE_DISPLAY_INFO[role].color;
};

export const getRoleName = (role: UserRole): string => {
  return ROLE_DISPLAY_INFO[role].name;
};

export const getRoleDescription = (role: UserRole): string => {
  return ROLE_DISPLAY_INFO[role].description;
};