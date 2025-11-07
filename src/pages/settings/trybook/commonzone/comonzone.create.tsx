// CommonZoneUpsertPage.tsx
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
import { CommonZoneService } from '@/services/trybook/commonzone';
import { useTranslation } from 'react-i18next';

type ZoneType = 'PARKING' | 'POOL' | 'GYM' | 'OTHER';

interface FormData {
  placeId?: IOption; // { value: number, label: string }
  name: string;
  type?: IOption; // { value: ZoneType, label: string }
  isActive?: IOption; // { value: boolean, label: string }
}

const TYPE_OPTIONS: IOption[] = [
  { value: 'PARKING', label: 'Parqueadero' },
  { value: 'POOL', label: 'Piscina' },
  { value: 'GYM', label: 'Gimnasio' },
  { value: 'OTHER', label: 'Otro' },
];

const ACTIVE_OPTIONS: IOption[] = [
  { value: 1, label: 'Activo' },
  { value: 0, label: 'Inactivo' },
];

export const CommonZoneCreatePage: FunctionComponent = () => {
  const { t } = useTranslation();
  const { go } = useNavigation();
  const { id } = useParams<{ id?: string }>(); // id numérico (CommonZone.id)
  const { selectedCompany } = useUserStore();

  const places: Signal<IOption[]> = useSignal([]);
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const loading = useSignal<boolean>(false);

  // título
  useEffect(() => {
    document.title = t('h_common_areas');
  }, []);

  // Cargar places para selector
  const getPlaces = useCallback(async () => {
    const req = await PlaceService.getSimpleList();
    if (req.getStatus()) places.value = req.getMany();
  }, []);

  // Setear valores iniciales en edición
  const setInitialValues = useCallback(async () => {
    loading.value = true;
    if (!id) return loading.value = false;
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) return;

    const req = await CommonZoneService.getCommonZone(numericId);
    if (!req.getStatus()) return loading.value = false;

    const model = req.getOne();
    initialValues.value = {
      placeId: model.placeId
        ? {
            value: model.placeId,
            label: model.place?.name ?? String(model.placeId),
          }
        : undefined,
      name: model.name ?? '',
      type: model.type
        ? (TYPE_OPTIONS.find((o) => o.value === model.type) ?? {
            value: model.type,
            label: model.type,
          })
        : undefined,
      isActive:
        typeof model.isActive === 'boolean'
          ? model.isActive
            ? ACTIVE_OPTIONS[0]
            : ACTIVE_OPTIONS[1]
          : ACTIVE_OPTIONS[0],
    };
    loading.value = false;
  }, [id]);

  const getAll = useCallback(async () => {
    loading.value = true;
    await getPlaces();
    await setInitialValues();
    loading.value = false;
  }, [getPlaces, setInitialValues]);

  useEffect(() => {
    if (selectedCompany) getAll();
  }, [selectedCompany, getAll]);

  const onSubmit = async (model: FormData) => {
    loading.value = true;
    const payload = {
      placeId: Number(model.placeId?.value),
      name: String(model.name || '').trim(),
      type: (model.type?.value as ZoneType) ?? 'PARKING',
      isActive: Boolean(model.isActive?.value),
    };

    const numericId = Number(id);
    const req = id
      ? await CommonZoneService.updateCommonZone(numericId, payload)
      : await CommonZoneService.createCommonZone(payload);

    if (!req.getStatus()) return loading.value = false;

    ToastManager.success(id ? 's_updated_success' : 's_created_success');
    go({
      to: '/trybook/commonzone',
      label: 'common-zones',
      id: 'trybook:common-zone:state',
      base: 'setting',
    });
    loading.value = false;
  };

  return (
    <Section className='p-4 space-y-2 max-h-[67vh] overflow-y-auto vox-scroll-design' loading={loading.value}>
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues.value}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form
            onSubmit={handleSubmit}
            className='space-y-6'
            id='form-common-zone-upsert'
          >
            <StatusButton
              onClickClean={() => form.reset()}
              submitting={submitting || loading.value}
              pristine={pristine}
              form='form-common-zone-upsert'
              label={id ? 'edit' : 'save'}
            />

            <div className='grid grid-cols-4 gap-2'>
              {/* Lugar */}
              <div className='col-span-2'>
                <Field<IOption> name='placeId' validate={required}>
                  {({ input, meta }) => (
                    <SmartSelector
                      {...input}
                      meta={meta}
                      placeholder='p_place'
                      label='l_set_place'
                      id='placeId'
                      icon='252'
                      options={places.value}
                      disabled={loading.value}
                    />
                  )}
                </Field>
              </div>

              {/* Nombre de la zona */}
              <div className='col-span-2'>
                <Field<string> name='name' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      placeholder='p_zone_name'
                      label='l_zone_name'
                      type='text'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>

              {/* Tipo */}
              <div className='col-span-2'>
                <Field<IOption> name='type' validate={required}>
                  {({ input, meta }) => (
                    <SmartSelector
                      {...input}
                      meta={meta}
                      placeholder='p_type'
                      label='l_zona_type'
                      id='type'
                      icon='layers'
                      options={TYPE_OPTIONS}
                      disabled={loading.value}
                    />
                  )}
                </Field>
              </div>

              {/* Estado (Activo/Inactivo) */}
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
