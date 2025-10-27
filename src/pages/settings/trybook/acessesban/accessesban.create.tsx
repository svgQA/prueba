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

import { AccessBanType, ICreateAccessBan } from '@/types/trybook/access-ban';
import { AccessBansService } from '@/services/trybook/access-bans';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useNavigation } from '@/utils/hooks/navigation';
import { UserService } from '@/services';

// ─────────────────────────────────────────────
// Opciones UI
// ─────────────────────────────────────────────
const ACTIVE_OPTIONS: IOption[] = [
  { value: 1, label: 'Activo' },
  { value: 0, label: 'Inactivo' },
];

const SUBJECT_TYPE: IOption[] = [
  { value: 'internal', label: 'Interno' },
  { value: 'external', label: 'Externo' },
];

// Nuevo: tipo de ban (debe mapear con el enum AccessBanType del backend)
const BAN_TYPE_OPTIONS: IOption[] = [
  { value: 'BAN', label: 'Ban' },
  { value: 'SPECIAL', label: 'Especial' },
];

type FormData = {
  subjectType: IOption; // 'internal' | 'external'
  user?: IOption;       // interno
  cardId?: string;      // externo
  username?: string;    // externo
  reason?: string;
  expiresAt?: string;   // datetime-local
  isActive?: IOption;   // 1/0
  banType?: IOption;    // 'BAN' | 'SPECIAL'
};

export const AccessBanForm: FunctionComponent = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id?: string }>();
  const { go } = useNavigation();

  const loading = useSignal<boolean>(false);
  const users = useSignal<IOption[]>([]);
  const initialValues = useSignal<Partial<FormData>>({
    subjectType: SUBJECT_TYPE[0],   // Interno por defecto
    isActive: ACTIVE_OPTIONS[0],    // Activo
    banType: BAN_TYPE_OPTIONS[0],   // BAN por defecto
  });

  // ─────────────────────────────────────────────
  // Cargar usuarios (empleados + clientes => opciones únicas)
  // ─────────────────────────────────────────────
  const loadUsers = useCallback(async () => {
    const pool: IOption[] = [];

    const emp = await UserService.getListUsers();
    if (emp.getStatus()) pool.push(...emp.getMany());

    const cli = await UserService.getListClients();
    if (cli.getStatus()) pool.push(...cli.getMany());

    const seen = new Set<any>();
    users.value = pool.filter((o) => {
      if (seen.has(o.value)) return false;
      seen.add(o.value);
      return true;
    });
  }, []);

  // ─────────────────────────────────────────────
  // Cargar registro en edición
  // ─────────────────────────────────────────────
  const loadInitial = useCallback(async () => {
    if (!id) return;

    const res = await AccessBansService.getAccessBan(id);
    if (!res.getStatus()) return;

    const model = res.getOne() as any; // { id, userId, user, cardId, username, reason, expiresAt, isActive, type }
    const isInternal = !!model.userId;

    initialValues.value = {
      subjectType: isInternal ? SUBJECT_TYPE[0] : SUBJECT_TYPE[1],
      user: isInternal
        ? {
            value: model.userId,
            label: model.user
              ? `${model.user.name ?? ''}${model.user.surname ? ' ' + model.user.surname : ''}`.trim() ||
                String(model.userId)
              : String(model.userId),
          }
        : undefined,
      cardId: !isInternal ? (model.cardId ?? '') : '',
      username: !isInternal ? (model.username ?? '') : '',
      reason: model.reason ?? '',
      expiresAt: model.expiresAt
        ? new Date(model.expiresAt).toISOString().slice(0, 16)
        : '',
      isActive: model.isActive ? ACTIVE_OPTIONS[0] : ACTIVE_OPTIONS[1],
      banType:
        BAN_TYPE_OPTIONS.find((o) => o.value === (model.type || 'BAN')) ??
        BAN_TYPE_OPTIONS[0],
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
  }, [getAll, t]);

  // ─────────────────────────────────────────────
  // Submit
  // ─────────────────────────────────────────────
  const onSubmit = async (data: FormData) => {
    loading.value = true;

    const isInternal = data.subjectType?.value === 'internal';

    // Validaciones UI
    if (isInternal && !data.user?.value) {
      ToastManager.error('Seleccione un usuario interno');
      loading.value = false;
      return;
    }
    if (!isInternal) {
      if (!data.cardId?.trim()) {
        ToastManager.error('cardId es obligatorio para externos');
        loading.value = false;
        return;
      }
      if (!data.username?.trim()) {
        ToastManager.error('name es obligatorio para externos');
        loading.value = false;
        return;
      }
    }

    // Construir payload
    const payload: ICreateAccessBan = {
      userId: isInternal ? Number(data.user!.value) : undefined,
      cardId: !isInternal ? data.cardId!.trim() : undefined,
      username: !isInternal ? data.username!.trim() : undefined,
      reason: data.reason?.trim() || undefined,
      expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : undefined,
      isActive: data.isActive?.value === 1,
      // Nuevo: tipo de ban
      type: (data.banType?.value as AccessBanType) ?? 'ban',
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

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  return (
    <Section className='p-4 space-y-2 max-h-[67vh] overflow-y-auto vox-scroll-design'>
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues.value}
        enableReinitialize
        render={({ handleSubmit, form, submitting, pristine, values }) => {
          const isInternal =
            (values.subjectType?.value ?? 'internal') === 'internal';

          return (
            <form
              className='space-y-6'
              id='form-access-ban-upsert'
              onSubmit={handleSubmit}
            >
              <StatusButton
                onClickClean={() => form.reset()}
                submitting={submitting || loading.value}
                pristine={pristine}
                form='form-access-ban-upsert'
                label={id ? 'edit' : 'save'}
              />

              <div className='grid grid-cols-4 gap-3'>
                {/* Interno / Externo */}
                <div className='col-span-2'>
                  <Field<IOption> name='subjectType' initialValue={SUBJECT_TYPE[0]}>
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        meta={meta}
                        placeholder='Tipo'
                        label='Tipo'
                        id='subjectType'
                        icon='toggle-right'
                        options={SUBJECT_TYPE}
                        disabled={loading.value}
                        allowAll={false}
                        onChange={(opt?: IOption) => {
                          input.onChange(opt);
                          // limpiar campos al cambiar tipo
                          if (opt?.value === 'internal') {
                            form.change('cardId', '');
                            form.change('username', '');
                          } else {
                            form.change('user', undefined);
                          }
                        }}
                      />
                    )}
                  </Field>
                </div>

                {/* Tipo de ban (BAN / SPECIAL) */}
                <div className='col-span-2'>
                  <Field<IOption> name='banType' initialValue={BAN_TYPE_OPTIONS[0]}>
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        meta={meta}
                        placeholder='Tipo de ban'
                        label='Tipo de ban'
                        id='banType'
                        icon='shield-alert'
                        options={BAN_TYPE_OPTIONS}
                        disabled={loading.value}
                        allowAll={false}
                      />
                    )}
                  </Field>
                </div>

                {/* Interno: Usuario */}
                {isInternal && (
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
                )}

                {/* Externo: cardId + name */}
                {!isInternal && (
                  <>
                    <div className='col-span-2'>
                      <Field<string> name='cardId'>
                        {({ input, meta }) => (
                          <Input
                            {...input}
                            placeholder='cardId'
                            label='cardId'
                            type='text'
                            meta={meta}
                          />
                        )}
                      </Field>
                    </div>
                    <div className='col-span-2'>
                      <Field<string> name='username'>
                        {({ input, meta }) => (
                          <Input
                            {...input}
                            placeholder='name'
                            label='name'
                            type='text'
                            meta={meta}
                          />
                        )}
                      </Field>
                    </div>
                  </>
                )}

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
                  <Field<IOption> name='isActive' initialValue={ACTIVE_OPTIONS[0]}>
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
          );
        }}
      />
    </Section>
  );
};
