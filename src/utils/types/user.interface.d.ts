import { IPagination } from '@/types';
import { USER_TYPE } from '@/types/user/user.enum';

export interface IPaginationUser extends IPagination {
  userType?: USER_TYPE;
}
