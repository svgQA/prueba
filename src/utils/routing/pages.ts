export enum PAGES_LIST {
  // GLOBAL ROUTES
  HOME = '/',
  SIGNIN = '/signin',
  SIGNUP = '/signup',
  DASHBOARD = '/dashboard',
  SHIFTS = '/shifts',
  ACCESS = '/access',
  FORMS = '/forms',
  MEMOS = '/memos',
  DEVICES = '/devices',
  SETTING = '/setting',
  SERVICES = '/services',
  // SETTING GENERAL ROUTES
  SETTING_USER = '/setting/user',
  SETTING_COMPANY = '/setting/company',
  SETTING_MODULES = '/setting/modules',
  SETTING_INTEGRATION = '/setting/integration',
  SETTING_VOXLINE = '/setting/voxline',
  SETTING_SOLO = '/setting/solo',
  // SETTING SECURITY ROUTES
  SETTING_ADMIN = '/setting/admin',
  SETTING_ADMIN_DATABASE = '/setting/admin/database',
  SETTING_ADMIN_TENANT = '/setting/admin/tenant',
  // SETTING SECURITY ROUTES
  SETTING_SECURITY_USERS = '/setting/security/users',
  SETTING_SECURITY_KEYS = '/setting/security/keys',
  SETTING_SECURITY_ROLES = '/setting/security/roles',
  SETTING_SECURITY_GROUPS = '/setting/security/groups',
  // SETTING PAYMENT ROUTES
  SETTING_PAYMENT_PAYMENT = '/setting/payment',
  SETTING_PAYMENT_HISTORY = '/setting/payment/history',
  // SETTING FORM ROUTES
  SETTING_FORMS = '/setting/form',
  SETTING_FORMS_CREATE = '/setting/form/create',
  SETTING_FORMS_ANALYTIC = '/setting/form/analytic',
  SETTING_FORMS_LIST = '/setting/form/list',
  SETTING_FORMS_REPORT = '/setting/form/report',
  SETTING_FORMS_INSPECT = '/setting/form/inspect',
  // SETTING IOT ROUTES
  SETTING_IOT_ANALYTIC = '/setting/iot',
  SETTING_IOT_DEVICES = '/setting/iot/devices',
  SETTING_IOT_CHANNELS = '/setting/iot/channels',
  // SETTING IA ROUTES
  SETTING_IA_ANALYTIC = '/setting/ia',
  // SETTING SALES ROUTES
  SETTING_SALES_ANALYTIC = '/setting/sales',
  // SETTING SHIFTS ROUNDS
  SETTING_SHIFTS_ROUNDS = '/setting/rounds',
  // SETTING ASOCIATE ROUTES
  SETTING_ASOCIATE_RESOURCES = '/setting/asociate',
  // SETTING ACCESS ROUTES
  SETTING_ACCESS_RESOURCES = '/setting/access',
  SETTING_ACCESS_SETS = '/setting/access/sets',
  SETTING_ACCESS_PLACES = '/setting/access/place',
  FALLBACK = '*',
}
