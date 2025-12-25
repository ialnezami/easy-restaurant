import { UserRole } from '@/types/user';
import Restaurant from '@/models/Restaurant';

export interface UserPermissions {
  canManageUsers: boolean;
  canManageAllRestaurants: boolean;
  canCreateRestaurant: boolean;
  canManageRestaurant: (restaurantId: string, userId: string) => Promise<boolean>;
}

export async function getUserPermissions(
  userId: string,
  userRole: string
): Promise<UserPermissions> {
  const isAdmin = userRole === UserRole.ADMIN;
  const isManager = userRole === UserRole.MANAGER;
  const isOwner = userRole === UserRole.OWNER;

  return {
    canManageUsers: isAdmin,
    canManageAllRestaurants: isAdmin,
    canCreateRestaurant: isOwner || isAdmin,
    canManageRestaurant: async (restaurantId: string, userId: string) => {
      if (isAdmin) return true;

      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) return false;

      // Owner can manage
      if (restaurant.owner.toString() === userId) return true;

      // Manager can manage if assigned
      if (isManager && restaurant.managers?.some((m: any) => m.toString() === userId)) {
        return true;
      }

      return false;
    },
  };
}

export function requireRole(allowedRoles: UserRole[]) {
  return (userRole: string) => {
    return allowedRoles.includes(userRole as UserRole);
  };
}

