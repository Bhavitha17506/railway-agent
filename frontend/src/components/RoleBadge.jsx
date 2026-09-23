import React from 'react';
import { ShieldCheck, HardHat, Wrench, Eye, UserCheck } from 'lucide-react';
import { ROLE_DETAILS } from '../config/rolePermissions';

export const RoleBadge = ({ role, showIcon = true, size = "md" }) => {
  const roleKey = (role || 'ENGINEER').toUpperCase();
  const config = ROLE_DETAILS[roleKey] || ROLE_DETAILS.ENGINEER;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-xs font-bold"
  };

  const icons = {
    ADMIN: ShieldCheck,
    ENGINEER: HardHat,
    INSPECTOR: UserCheck,
    MAINTENANCE: Wrench,
    VIEWER: Eye
  };

  const Icon = icons[roleKey] || HardHat;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold border ${config.badgeColor} ${sizeClasses[size] || sizeClasses.md}`}
    >
      {showIcon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{config.badgeLabel}</span>
    </span>
  );
};
