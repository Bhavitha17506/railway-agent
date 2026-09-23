import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Conditionally renders children if the authenticated user has the specified permission or role.
 * If fallback is provided, it will render the fallback component instead of null.
 */
export const PermissionGate = ({
  permission,
  roles,
  children,
  fallback = null
}) => {
  const { user, can, hasRole } = useAuth();

  if (!user) return fallback;

  if (roles && !hasRole(roles)) {
    return fallback;
  }

  if (permission && !can(permission)) {
    return fallback;
  }

  return <>{children}</>;
};
