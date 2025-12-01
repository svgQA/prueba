export interface IUserSetting {
  id: number;
  name: string;
  allow_areas: boolean;
  allow_roles: boolean;
  allow_users: boolean;
  allow_groups: boolean;
  allow_departments: boolean;
  allow_positions: boolean;
  allow_permissions: boolean;
  allow_update_password: boolean;
  allow_update_profile: boolean;
}
