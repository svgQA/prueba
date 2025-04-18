import { IModalSidebarMenu } from '@/components/compose/modal';

import { MODAL_SETTING_ADMIN } from './admin';
import { MODAL_SETTING_GENERAL } from './general';
import { MODAL_SETTING_SECURITY } from './security';
import { MODAL_SETTING_PAYMENT } from './payment';
import { MODAL_SETTING_FORM } from './form';
import { MODAL_SETTING_IOT } from './iot';
import { MODAL_SETTING_SHIFT } from './shift';
import { MODAL_SETTING_IA } from './ia';
import { MODAL_SETTING_SALES } from './sales';
import { MODAL_SETTING_ASSOCIATE } from './asociate';
import { MODAL_SETTING_ACCESS } from './access';
import { MODAL_SETTING_MEMO } from './memo';
import { MODAL_SETTING_USER } from './user';
import { MODAL_SETTING_NOTIFICATIONS } from './notifications';

export const MODAL_SIDEBAR_MENUS: IModalSidebarMenu[] = [
  MODAL_SETTING_ADMIN,
  MODAL_SETTING_GENERAL,
  MODAL_SETTING_USER,
  MODAL_SETTING_SHIFT,
  MODAL_SETTING_FORM,
  MODAL_SETTING_MEMO,
  MODAL_SETTING_IA,
  MODAL_SETTING_ACCESS,
  MODAL_SETTING_SECURITY,
  MODAL_SETTING_PAYMENT,
  MODAL_SETTING_IOT,
  MODAL_SETTING_SALES,
  MODAL_SETTING_ASSOCIATE,
  MODAL_SETTING_NOTIFICATIONS
];
