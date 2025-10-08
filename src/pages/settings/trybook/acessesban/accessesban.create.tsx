// pages/trybook/access-bans/form.tsx
import { FunctionComponent } from 'preact';
import { useEffect, useCallback } from 'preact/hooks';
import { useParams } from 'wouter';
import { useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';

import { Section } from '@/components/common/section/section';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { Input } from '@/components/common/input/input';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { IOption } from '@/components/common/multi/interface';

import { IAccessBan, ICreateAccessBan } from '@/types/trybook/access-ban';
import { AccessBansService } from '@/services/trybook/access-bans';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useNavigation } from '@/utils/hooks/navigation';
import { UserService } from '@/services';


const ACTIVE_OPTIONS: IOption[] = [
  { value: 1, label: 'Activo' },
  { value: 0, label: 'Inactivo' },
];

type FormData = {
  user?: IOption;
  reason?: string;
  expiresAt?: string; // datetime-local
  isActive?: IOption; // 1/0
};

export const AccessBanForm: FunctionComponent = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id?: string }>();
  const { go } = useNavigation();

  const loading = useSignal<boolean>(false);
  const users = useSignal<IOption[]>([]);
  const initialValues = useSignal<Partial<FormData>>({});

  // ───────────────────────────────────────────────
  // Cargar usuarios para el selector (empleados + clientes)
  // ───────────────────────────────────────────────
  const loadUsers = useCallback(async () => {
    const pool: IOption[] = [];

    const emp = await UserService.getListUsers();
    if (emp.getStatus()) pool.push(...emp.getMany());

    const cli = await UserService.getListClients();
    if (cli.getStatus()) pool.push(...cli.getMany());

    // dedupe por value
    const seen = new Set<any>();
    users.value = pool.filter((o) => {
      if (seen.has(o.value)) return false;
      seen.add(o.value);
      return true;
    });
  }, []);

  const loadInitial = useCallback(async () => {
    if (!id) {
      initialValues.value = { isActive: ACTIVE_OPTIONS[0] };
      return;
    }
    const res = await AccessBansService.getAccessBan(id);
    if (!res.getStatus()) return;

    const model = res.getOne() as IAccessBan;
    initialValues.value = {
      user: model.userId
        ? {
            value: model.userId,
            label: model.user
              ? `${model.user.name}${model.user.surname ? ' ' + model.user.surname : ''}`
              : String(model.userId),
          }
        : undefined,
      reason: model.reason ?? '',
      expiresAt: model.expiresAt
        ? new Date(model.expiresAt).toISOString().slice(0, 16)
        : '',
      isActive: model.isActive ? ACTIVE_OPTIONS[0] : ACTIVE_OPTIONS[1],
    };
  }, [id]);

  const getAll = useCallback(async () => {
    loading.value = true;
    await loadUsers();
    await loadInitial();
    loading.value = false;
  }, [loadUsers, loadInitial]);

  useEffect(() => {
    document.title = t('h_access_bans') || 'Access Bans';
    void getAll();
  }, [getAll]);

  const onSubmit = async (data: FormData) => {
    loading.value = true;

    const payload: ICreateAccessBan = {
      userId: data.user?.value ? Number(data.user.value) : undefined,
      reason: data.reason?.trim() || undefined,
      expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : undefined,
      isActive: data.isActive?.value === 1,
    };

    const req = id
      ? await AccessBansService.updateAccessBan(id, payload)
      : await AccessBansService.createAccessBan(payload);

    if (!req.getStatus()) {
      loading.value = false;
      return;
    }

    ToastManager.success(id ? 's_updated_success' : 's_created_success');
    go({
      to: '/trybook/access-bans',
      label: 'access-bans',
      id: 'trybook:access-bans:state',
      base: 'setting',
    });
  };

  return (
    <Section className='p-4 space-y-2 max-h-[67vh] overflow-y-auto vox-scroll-design'>
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues.value}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form className='space-y-6' id='form-access-ban-upsert' onSubmit={handleSubmit}>
            <StatusButton
              onClickClean={() => form.reset()}
              submitting={submitting || loading.value}
              pristine={pristine}
              form='form-access-ban-upsert'
              label={id ? 'edit' : 'save'}
            />

            <div className='grid grid-cols-4 gap-3'>
              {/* Usuario (opcional) */}
              <div className='col-span-2'>
                <Field<IOption> name='user'>
                  {({ input, meta }) => (
                    <SmartSelector
                      {...input}
                      meta={meta}
                      placeholder='h_user'
                      label='h_user'
                      id='user'
                      icon='252'
                      options={users.value}
                      disabled={loading.value}
                      allowAll
                      menuPortalTarget={document.body}
                    />
                  )}
                </Field>
              </div>

              {/* Motivo */}
              <div className='col-span-2'>
                <Field<string> name='reason'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      placeholder='h_reason'
                      label='h_reason'
                      type='text'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>

              {/* Expira */}
              <div className='col-span-2'>
                <Field<string> name='expiresAt'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      placeholder='h_expires'
                      label='h_expires'
                      type='datetime-local'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>

              {/* Estado */}
              <div className='col-span-2'>
                <Field<IOption> name='isActive'>
                  {({ input, meta }) => (
                    <SmartSelector
                      {...input}
                      meta={meta}
                      placeholder='p_select_state'
                      label='l_status'
                      id='isActive'
                      icon='toggle-right'
                      options={ACTIVE_OPTIONS}
                      disabled={loading.value}
                    />
                  )}
                </Field>
              </div>
            </div>
          </form>
        )}
      />
    </Section>
  );
};
