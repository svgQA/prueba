import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { required } from '@/utils/utilities';
import { Section } from '@/components/common/section/section';
import { useParams } from 'wouter';
import { useEffect, useCallback } from 'preact/hooks';
import { Input } from '@/components/common/input/input';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { IOption } from '@/components/common/multi/interface';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useNavigation } from '@/utils/hooks/navigation';
import { useUserStore } from '@/store/slices';

import { PlaceService } from '@/services';
import { UserService } from '@/services/general/user';
import { IUserResidenceRequest } from '@/types/user/user.request';

type ResidenceType = 'HOUSE' | 'APARTMENT';

interface FormData {
  type?: IOption; // { value: 'HOUSE'|'APARTMENT', label: string }
  houseNumber: string;
  block?: string;
  floor?: number;
  placeId?: IOption;
  userId?: IOption;
}

const TYPE_OPTIONS: IOption[] = [
  { value: 'HOUSE', label: 'Casa' },
  { value: 'APARTMENT', label: 'Apartamento' },
];

export const ResidenceCreatePage: FunctionComponent = () => {
  const { go } = useNavigation();
  const { uuid } = useParams<{ uuid?: string }>(); // 👈 ahora usamos uuid
  const { selectedCompany } = useUserStore();

  const places: Signal<IOption[]> = useSignal([]);
  const users: Signal<IOption[]> = useSignal([]);
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const loading = useSignal<boolean>(false);

  const getPlaces = useCallback(async () => {
    const req = await PlaceService.getSimpleList();
    if (req.getStatus()) places.value = req.getMany();
  }, []);

  const getUsers = useCallback(async () => {
    const req = await UserService.getListUsers();
    if (req.getStatus()) users.value = req.getMany();
  }, []);

  const setInitialValues = useCallback(async () => {
    if (!uuid) return;
    const req = await UserService.getResidence(uuid); // 👈 pide por uuid
    if (!req.getStatus()) return;

    const model = req.getOne();
    initialValues.value = {
      type: model.type
        ? (TYPE_OPTIONS.find((o) => o.value === model.type) ?? {
            value: model.type,
            label: model.type,
          })
        : undefined,
      houseNumber: model.houseNumber,
      block: model.block ?? '',
      floor: typeof model.floor === 'number' ? model.floor : undefined,
      placeId: model.placeId
        ? {
            value: model.placeId,
            label: model.place?.name ?? String(model.placeId),
          }
        : undefined,
      userId: model.userId
        ? {
            value: model.userId,
            label: model.user?.name ?? String(model.userId),
          }
        : undefined,
    };
  }, [uuid]);

  const getAll = useCallback(async () => {
    loading.value = true;
    await Promise.all([getPlaces(), getUsers()]);
    await setInitialValues();
    loading.value = false;
  }, [getPlaces, getUsers, setInitialValues]);

  useEffect(() => {
    if (selectedCompany) {
      getAll();
    }
  }, [selectedCompany, getAll]);

  const onSubmit = async (model: FormData) => {
    // Construir payload según DTO nuevo
    const payload: IUserResidenceRequest = {
      type: (model.type?.value as ResidenceType) ?? 'HOUSE',
      houseNumber: String(model.houseNumber).trim(),
      block: model.block?.trim() || undefined,
      floor:
        (model.type?.value as ResidenceType) === 'APARTMENT'
          ? Number.isFinite(model.floor)
            ? Number(model.floor)
            : 0
          : 0,
      placeId: Number(model.placeId?.value),
      userId: Number(model.userId?.value),
      // companyId ya lo envía el backend por header (no se manda en payload)
    };

    const req = uuid
      ? await UserService.updateResidence(uuid, payload) // 👈 update por uuid
      : await UserService.createResidence(payload);

    if (!req.getStatus()) return;

    ToastManager.success(uuid ? 's_updated_success' : 's_created_success');
    go({
      to: '/users/residences',
      label: 'residences',
      id: 'user:residences:state',
      base: 'setting',
    });
  };

  return (
    <Section className='p-4 space-y-2 max-h-[67vh] overflow-y-auto vox-scroll-design'>
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues.value}
        render={({ handleSubmit, form, submitting, pristine }) => {
          const values = form.getState().values as FormData;
          const isApartment = values.type?.value === 'APARTMENT';

          return (
            <form
              onSubmit={handleSubmit}
              className='space-y-6'
              id='form-residence-create'
            >
              <StatusButton
                onClickClean={() => form.reset()}
                submitting={submitting || loading.value}
                pristine={pristine}
                form='form-residence-create'
                label={uuid ? 'edit' : 'save'}
              />

              <div className='grid grid-cols-4 gap-2'>
                {/* Tipo */}
                <div className='col-span-2'>
                  <Field<IOption> name='type' validate={required}>
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        meta={meta}
                        placeholder='user.residence.placeholder.type'
                        label='user.residence.form.type'
                        id='type'
                        icon='home'
                        options={TYPE_OPTIONS}
                        disabled={loading.value}
                      />
                    )}
                  </Field>
                </div>

                {/* Bloque / Torre (opcional) */}
                <div className='col-span-2'>
                  <Field<string> name='block'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder='user.residence.placeholder.block'
                        label='user.residence.form.block'
                        type='text'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>

                {/* Piso (solo aplica si es APARTMENT) */}
                <div className='col-span-2'>
                  <Field<number> name='floor'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder='user.residence.placeholder.floor'
                        label='user.residence.form.floor'
                        type='number'
                        meta={meta}
                        disabled={!isApartment}
                        onInput={(e: any) =>
                          input.onChange(Number(e.currentTarget.value))
                        }
                        value={
                          typeof input.value === 'number'
                            ? input.value
                            : isApartment
                              ? ''
                              : 0
                        }
                      />
                    )}
                  </Field>
                </div>

                {/* Número de casa / apartamento */}
                <div className='col-span-2'>
                  <Field<string> name='houseNumber' validate={required}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder='user.residence.placeholder.houseNumber'
                        label='user.residence.form.houseNumber'
                        type='text'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>

                {/* Lugar */}
                <div className='col-span-2'>
                  <Field<IOption> name='placeId' validate={required}>
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        meta={meta}
                        placeholder='user.residence.placeholder.place'
                        label='user.residence.form.place'
                        id='placeId'
                        icon='252'
                        options={places.value}
                        disabled={loading.value}
                      />
                    )}
                  </Field>
                </div>

                {/* Usuario */}
                <div className='col-span-2'>
                  <Field<IOption> name='userId' validate={required}>
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        meta={meta}
                        placeholder='user.residence.placeholder.user'
                        label='user.residence.form.user'
                        id='userId'
                        icon='241'
                        options={users.value}
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
