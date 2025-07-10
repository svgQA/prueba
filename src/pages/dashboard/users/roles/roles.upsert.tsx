import { Input } from '@/components/common/input/input';
// import { Section } from '@/components/common/section/section';
import { ToastManager } from '@/utils/toast/toast-manager';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { useLocation, useParams } from 'wouter';
import { Form } from 'react-final-form';
import { Field } from 'react-final-form';
import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { useTranslation } from 'react-i18next';
// import { TextArea } from '@/components/common/text.area/text.area';
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
  const [_, navigate] = useLocation();
  const { t } = useTranslation();
  const modules: Signal<IListModuleResponse[]> = useSignal([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const { id } = useParams(); // Obtiene el id de la URL
  const initialValues: Signal<Partial<IRoleRequest>> = useSignal({});

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      Promise.all([getModules(), setInitialValues()]);
    }
  }, [selectedCompany, location]);

  const setInitialValues = async () => {
    if (!id) return;

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

    if (!request.getStatus()) return;
    ToastManager.success(message);
    navigate(PAGES_LIST_ROUTER.dashboard.setting.users.roles.to);
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

  return (
    <>
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
                      label={t('role.form.name')}
                      placeholder={t('role.form.placeholderName')}
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
                      placeholder={'p_write'}
                      meta={meta}
                      type='text'
                      label={'description'}
                    />
                  )}
                </Field>
              </div>
            </div>

            <div className='col-span-2  max-h-[65vh] overflow-x-hidden vox-scroll-design'>
              <h3 className='text-lg font-medium mb-4'>Módulos:</h3>
              <div className='space-y-4'>
                {modules.value?.map((module) => (
                  <ExpansionPanel
                    title={module.name}
                    key={module.id}
                    subtitle={module.description}
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
                                      {permission.name}
                                    </span>
                                    <span className='text-xs text-gray-500'>
                                      {permission.description}
                                    </span>
                                    <span className='text-xs text-gray-500'>
                                      <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800'>
                                        {permission.key}
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
                                            <span className='text-xs text-gray-500'>
                                              <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800'>
                                                {child.permission?.key}
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
                                                <span className='text-xs text-gray-500'>
                                                  <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800'>
                                                    {subChild.permission?.key}
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
    </>
  );
};

export default RolesUpsertPage;
