import { Input } from '@/components/common/input/input';
import { ToastManager } from '@/utils/toast/toast-manager';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { useParams } from 'wouter';
import { Form } from 'react-final-form';
import { Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { required } from '@/utils/utilities';
import { RoleService } from '@/services/general/role';
import { Signal, useSignal } from '@preact/signals';
import { useEffect, useState } from 'react';
import {
  IListModuleResponse,
  IPermission,
  RolePermission,
} from '@/types/role/role.response';
import { IRoleRequest } from '@/types/role/role.request';
import { ExpansionPanel } from '@/components/common/expansion-panels/expansion-panels';
import { useUserStore } from '@/store/slices';
// import { MODAL_SETTING_USER } from '@/utils/menus/settings/user';
import { useNavigation } from '@/utils/hooks/navigation';
import { Section } from '@/components/common/section/section';

interface RawPermission extends Omit<IPermission, 'moduleId'> {}

type PermissionTree = {
  key: string;
  permission?: RawPermission;
  children: PermissionTree[];
};

type GroupedPermissions = {
  flat: RawPermission[]; // sin jerarquía
  tree: PermissionTree[]; // jerárquicos
};

export const RolesUpsertPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { go } = useNavigation();
  const modules: Signal<IListModuleResponse[]> = useSignal([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [platformFilter, setPlatformFilter] = useState<
    'all' | 'mobile' | 'web'
  >('all');
  const initialValues: Signal<Partial<IRoleRequest>> = useSignal({});
  const loading = useSignal<boolean>(false);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      Promise.all([getModules(), setInitialValues()]);
    }
  }, [selectedCompany, location]);

  const setInitialValues = async () => {
    loading.value = true;
    if (!id) return (loading.value = false);

    const request = await RoleService.getRoleById(id);
    const role = request.getOne();

    initialValues.value = {
      name: role.name,
      id: role.id,
      description: role.description,
    };

    const permissions = role.permissions.map(
      (permission: RolePermission) => permission.permissionId
    );
    setSelectedPermissions(permissions);
    loading.value = false;
  };

  const handlePermissionToggle = (id: number, checked: boolean) => {
    setSelectedPermissions((prev: number[]) => {
      if (checked) {
        return [...prev, id];
      } else {
        return prev.filter((permId: number) => permId !== id);
      }
    });
  };

  const onSubmit = async (form: IRoleRequest) => {
    loading.value = true;
    if (!form.name || !form.description) {
      ToastManager.error('s_some_required');
      return;
    }
    if (selectedPermissions.length === 0) {
      ToastManager.error('s_must_some_selected');
      return;
    }

    form.permissions = selectedPermissions;
    let message: string = '';
    let request = null;

    if (id) {
      request = await RoleService.update(form, id);
      message = 's_updated_success';
    } else {
      request = await RoleService.create(form);
      message = 's_created_success';
    }

    if (!request.getStatus()) return (loading.value = false);
    ToastManager.success(message);
    // go(MODAL_SETTING_USER.menus[1]);
    go({
      to: '/users/roles',
      label: 'm_role',
      id: 'user:roles:state',
      base: 'setting',
    });
    loading.value = false;
  };

  const getModules = async () => {
    const response = await RoleService.getModulesList();
    modules.value = groupByModule(response.getMany());
  };

  function groupPermissionsByKey(
    permissions: RawPermission[]
  ): GroupedPermissions {
    const treeMap: Record<
      string,
      {
        key: string;
        permission?: RawPermission;
        children: Record<string, any>;
      }
    > = {};

    const flat: RawPermission[] = [];

    for (const perm of permissions) {
      if (!perm.key.includes(':')) {
        flat.push(perm); // sin jerarquía
        continue;
      }

      const parts = perm.key.split(':');
      let current = treeMap;

      for (let i = 0; i < parts.length; i++) {
        const keyPart = parts.slice(0, i + 1).join(':');

        if (!current[keyPart]) {
          current[keyPart] = {
            key: keyPart,
            children: {},
          };
        }

        if (i === parts.length - 1) {
          current[keyPart].permission = perm;
        }

        current = current[keyPart].children;
      }
    }

    function toArray(obj: Record<string, any>): PermissionTree[] {
      return Object.values(obj).map(({ key, permission, children }) => ({
        key,
        permission,
        children: toArray(children),
      }));
    }

    return {
      flat,
      tree: toArray(treeMap),
    };
  }

  function groupByModule(
    modules: IListModuleResponse[]
  ): (IListModuleResponse & { permissionsGrouped: GroupedPermissions })[] {
    return modules.map((module) => ({
      ...module,
      permissionsGrouped: groupPermissionsByKey(module.permissions),
    }));
  }

  // Función para filtrar permisos por plataforma
  const filterPermissionsByPlatform = (
    permissions: RawPermission[]
  ): RawPermission[] => {
    if (platformFilter === 'all') return permissions;
    return permissions.filter((permission) =>
      platformFilter === 'mobile' ? permission.mobile : !permission.mobile
    );
  };

  // Función para filtrar el árbol de permisos por plataforma
  const filterPermissionTreeByPlatform = (
    tree: PermissionTree[]
  ): PermissionTree[] => {
    if (platformFilter === 'all') return tree;

    return tree
      .map((group) => {
        const filteredChildren = group.children
          .map((child) => {
            const filteredSubChildren = child.children.filter((subChild) => {
              if (!subChild.permission) return true;
              return platformFilter === 'mobile'
                ? subChild.permission.mobile
                : !subChild.permission.mobile;
            });

            return {
              ...child,
              children: filteredSubChildren,
              permission:
                child.permission &&
                (platformFilter === 'mobile'
                  ? child.permission.mobile
                  : !child.permission.mobile)
                  ? child.permission
                  : undefined,
            };
          })
          .filter((child) => child.permission || child.children.length > 0);

        return {
          ...group,
          children: filteredChildren,
        };
      })
      .filter((group) => group.children.length > 0);
  };

  // Función para obtener módulos filtrados por plataforma
  const getFilteredModules = () => {
    return modules.value
      .map((module) => ({
        ...module,
        permissionsGrouped: {
          flat: filterPermissionsByPlatform(
            module.permissionsGrouped?.flat || []
          ),
          tree: filterPermissionTreeByPlatform(
            module.permissionsGrouped?.tree || []
          ),
        },
      }))
      .filter(
        (module) =>
          module.permissionsGrouped.flat.length > 0 ||
          module.permissionsGrouped.tree.length > 0
      );
  };

  return (
    <Section
      className='p-4 space-y-2 max-h-[67vh] overflow-y-auto vox-scroll-design'
      loading={loading.value}
    >
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues.value}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form onSubmit={handleSubmit} className='space-y-1' id='form-role'>
            <StatusButton
              onClickClean={() => form.reset()}
              submitting={submitting}
              pristine={pristine}
              form='form-role'
              label='save'
            />
            <div className='grid grid-cols-2 gap-4'>
              <div className='col-span-1'>
                <Field<string> name='name' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      id='name'
                      meta={meta}
                      name='name'
                      type='text'
                      label='l_name'
                      placeholder='p_name_role'
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field<string> name='description' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      id='description'
                      placeholder='p_element_description'
                      meta={meta}
                      type='text'
                      label='h_description'
                    />
                  )}
                </Field>
              </div>
            </div>

            <div className='col-span-2  max-h-[65vh] overflow-x-hidden vox-scroll-design'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-medium'>{t('h_title_modules')}:</h3>

                {/* Filtro de plataforma */}
                <div className='flex items-center space-x-4'>
                  <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    {t('l_filter_platform')}:
                  </label>
                  <div className='flex space-x-2'>
                    <button
                      type='button'
                      onClick={() => setPlatformFilter('all')}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        platformFilter === 'all'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {t('all')}
                    </button>
                    <button
                      type='button'
                      onClick={() => setPlatformFilter('web')}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        platformFilter === 'web'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {t('web')}
                    </button>
                    <button
                      type='button'
                      onClick={() => setPlatformFilter('mobile')}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        platformFilter === 'mobile'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {t('mobile')}
                    </button>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                {getFilteredModules()?.map((module) => (
                  <ExpansionPanel
<<<<<<< HEAD
                    title={
                      module.key ? t(`modules.${module.key}`) : module.name
                    }
                    key={module.id}
                    subtitle={
                      module.key
                        ? t(`module_descriptions.${module.key}`)
                        : module.description
                    }
=======
                    title={module.key ? t(`modules.${module.key}`) : module.name}
                    key={module.id}
                    subtitle={module.key ? t(`module_descriptions.${module.key}`) : module.description}
>>>>>>> 62ebc4dd9 (Feat/e2e: Icons)
                    onCheck={(checked) => {
                      const flatPermissionIds =
                        module.permissionsGrouped?.flat.map((p) => p.id) || [];

                      const getAllTreePermissionIds = (
                        tree: PermissionTree[]
                      ): number[] => {
                        return tree.reduce((ids: number[], group) => {
                          if (group.permission?.id) {
                            ids.push(group.permission.id);
                          }
                          if (group.children?.length) {
                            ids.push(
                              ...getAllTreePermissionIds(group.children)
                            );
                          }
                          return ids;
                        }, []);
                      };

                      const treePermissionIds = getAllTreePermissionIds(
                        module.permissionsGrouped?.tree || []
                      );

                      const allPermissionIds = [
                        ...flatPermissionIds,
                        ...treePermissionIds,
                      ];

                      if (checked) {
                        // Add all permissions that aren't already selected
                        setSelectedPermissions((prev) => [
                          ...prev,
                          ...allPermissionIds.filter(
                            (id) => !prev.includes(id)
                          ),
                        ]);
                      } else {
                        // Remove all permissions belonging to this module
                        setSelectedPermissions((prev) =>
                          prev.filter((id) => !allPermissionIds.includes(id))
                        );
                      }
                    }}
                  >
                    <div className='border rounded-lg p-4 border-b-light-dark dark:border-b-dark-light'>
                      <div className='ml-6 space-y-2'>
                        <div className='flex flex-row flex-wrap gap-2 justify-center py-2'>
                          {module.permissionsGrouped?.flat.map((permission) => (
                            <Field
                              key={permission.id}
                              name={`permission_${permission.id}`}
                              type='checkbox'
                              render={({ input }) => (
                                <div className='flex items-center'>
                                  <input
                                    {...input}
                                    type='checkbox'
                                    className='h-4 w-4 rounded border-gray-300'
                                    checked={selectedPermissions.includes(
                                      permission.id
                                    )}
                                    onChange={(e) =>
                                      handlePermissionToggle(
                                        permission.id,
                                        e.currentTarget.checked
                                      )
                                    }
                                  />
                                  <label className='ml-2 flex flex-col'>
                                    <span className='text-sm font-medium'>
<<<<<<< HEAD
                                      {permission.key
                                        ? t(
                                            `role_permissions.${permission.key}`
                                          )
                                        : permission.name}
                                    </span>
                                    <span className='text-xs text-gray-500'>
                                      {permission.key
                                        ? t(
                                            `role_descriptions.${permission.key}`
                                          )
                                        : permission.description}
=======
                                      {permission.key ? t(`role_permissions.${permission.key}`) : permission.name}
                                    </span>
                                    <span className='text-xs text-gray-500'>
                                      {permission.key ? t(`role_descriptions.${permission.key}`) : permission.description}
>>>>>>> 62ebc4dd9 (Feat/e2e: Icons)
                                    </span>
                                    <span className='text-xs text-gray-500 flex items-center gap-2'>
                                      <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800'>
                                        {permission.key}
                                      </span>
                                      <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                          permission.mobile
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-purple-100 text-purple-800'
                                        }`}
                                      >
<<<<<<< HEAD
                                        {permission.mobile
                                          ? t('mobile')
                                          : t('web')}
=======
                                        {permission.mobile ? t('mobile') : t('web')}
>>>>>>> 62ebc4dd9 (Feat/e2e: Icons)
                                      </span>
                                    </span>
                                  </label>
                                </div>
                              )}
                            />
                          ))}
                        </div>
                        <div
                          className={`flex flex-row flex-wrap py-2 justify-center w-full ${module.permissionsGrouped?.tree.length ? 'border-t' : ''} border-b-light-dark dark:border-b-dark-light`}
                        >
                          {module.permissionsGrouped?.tree.map((group) => (
                            <div
                              key={group.key}
                              className='py-2 mx-1 px-2 min-w-[400px] divide-y divide-b-light-dark dark:divide-b-dark-light'
                            >
                              <div className='font-medium text-sm mb-2'>
                                {t(`m_${group.key}`)}
                              </div>
                              {group.children.map((child: PermissionTree) => (
                                <div key={child.key} className='ml-4 mb-2'>
                                  {child.permission && (
                                    <Field
                                      key={child.permission.id}
                                      name={`permission_${child.permission.id}`}
                                      type='checkbox'
                                      render={({ input }) => (
                                        <div className='flex items-center'>
                                          <input
                                            {...input}
                                            type='checkbox'
                                            className='h-4 w-4 rounded border-gray-300'
                                            checked={selectedPermissions.includes(
                                              child.permission?.id || 0
                                            )}
                                            onChange={(e) =>
                                              handlePermissionToggle(
                                                child.permission?.id || 0,
                                                e.currentTarget.checked
                                              )
                                            }
                                          />
                                          <label className='ml-2 flex flex-col'>
                                            <span className='text-sm font-medium'>
                                              {child.permission?.name}
                                            </span>
                                            <span className='text-xs text-gray-500'>
                                              {child.permission?.description}
                                            </span>
                                            <span className='text-xs text-gray-500 flex items-center gap-2'>
                                              <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800'>
                                                {child.permission?.key}
                                                </span>
                                                <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                  child.permission?.mobile
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-purple-100 text-purple-800'
                                                }`}
                                                >
                                                {child.permission?.mobile
                                                  ? 'Móvil'
                                                  : 'Web'}
                                              </span>
                                            </span>
                                          </label>
                                        </div>
                                      )}
                                    />
                                  )}
                                  {child.children?.map(
                                    (subChild: PermissionTree) => (
                                      <div key={subChild.key} className='ml-4'>
                                        <Field
                                          key={subChild.permission?.id}
                                          name={`permission_${subChild.permission?.id}`}
                                          type='checkbox'
                                          render={({ input }) => (
                                            <div className='flex items-center'>
                                              <input
                                                {...input}
                                                type='checkbox'
                                                className='h-4 w-4 rounded border-gray-300'
                                                checked={selectedPermissions.includes(
                                                  subChild.permission?.id || 0
                                                )}
                                                onChange={(e) =>
                                                  handlePermissionToggle(
                                                    subChild.permission?.id ||
                                                      0,
                                                    e.currentTarget.checked
                                                  )
                                                }
                                              />
                                              <label className='ml-2 flex flex-col'>
                                                <span className='text-sm font-medium'>
                                                  {subChild.permission?.name}
                                                </span>
                                                <span className='text-xs text-gray-500'>
                                                  {
                                                    subChild.permission
                                                      ?.description
                                                  }
                                                </span>
                                                <span className='text-xs text-gray-500 flex items-center gap-2'>
                                                  <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800'>
                                                    {subChild.permission?.key}
                                                  </span>
                                                  <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                      subChild.permission
                                                        ?.mobile
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-purple-100 text-purple-800'
                                                    }`}
                                                  >
                                                    {subChild.permission?.mobile
                                                      ? 'Móvil'
                                                      : 'Web'}
                                                  </span>
                                                </span>
                                              </label>
                                            </div>
                                          )}
                                        />
                                      </div>
                                    )
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ExpansionPanel>
                ))}
              </div>
            </div>
          </form>
        )}
      />
    </Section>
  );
};

export default RolesUpsertPage;
