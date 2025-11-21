// ResourceZoneCreatePage.tsx
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
import { CommonZoneService } from '@/services/trybook/commonzone';
import { ResourceZoneService } from '@/services/trybook/resourcezone';

type ResourceZoneType = 'EQUIPMENT' | 'TOOL' | 'GAME' | 'OTHER';

interface FormData {
  name: string;
  type?: IOption; // { value: 'EQUIPMENT'|'TOOL'|'GAME'|'OTHER', label: string }
  zoneId?: IOption;

  quantity?: number;
  isBookable?: IOption; // boolean via IOption
  requiresApproval?: IOption; // boolean via IOption
  minDurationMinutes?: number;
  maxDurationMinutes?: number;
  bufferMinutes?: number;

  description?: string;
  image?: string;
  icon?: string;
}

const TYPE_OPTIONS: IOption[] = [
  { value: 'EQUIPMENT', label: 'Equipo' },
  { value: 'TOOL', label: 'Herramienta' },
  { value: 'GAME', label: 'Recreación' },
  { value: 'OTHER', label: 'Otro' },
];

const BOOL_OPTIONS: IOption[] = [
  { value: true as any, label: 'Sí' },
  { value: false as any, label: 'No' },
];

export const ResourceZoneCreatePage: FunctionComponent = () => {
  const { go } = useNavigation();
  const { id } = useParams<{ id?: string }>(); // id numérico del resourceZone
  const { selectedCompany } = useUserStore();

  const zones: Signal<IOption[]> = useSignal([]);
  const rawZones: Signal<
    Array<{ id: number; name: string; type: string; place?: { name?: string } }>
  > = useSignal([]);
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const loading = useSignal<boolean>(false);

  // ← Solo zonas comunes cuyo type != 'PARKING'
  // ← reemplaza tu getZones por este (no filtra visualmente)
  const getZones = useCallback(async () => {
    const req = await CommonZoneService.getCommonZones();
    if (!req.getStatus()) return;

    const list = req.getMany() as Array<{
      id: number;
      name: string;
      type: string;
      place?: { name?: string };
    }>;
    rawZones.value = list;

    // Mostramos todas, pero marcamos cuáles son PARKING para que el usuario lo vea.
    zones.value = list.map((z) => ({
      value: String(z.id),
      label: `${z.name}${z.place?.name ? ' · ' + z.place.name : ''}${String(z.type).toUpperCase() === 'PARKING' ? ' (PARKING – no recursos)' : ''}`,
    }));
  }, []);

  const setInitialValues = useCallback(async () => {
    loading.value = true;
    if (!id) return (loading.value = false);
    const req = await ResourceZoneService.getResourceZone(Number(id));
    if (!req.getStatus()) return (loading.value = false);

    const model = req.getOne();
    initialValues.value = {
      name: model.name,
      type: model.type
        ? (TYPE_OPTIONS.find((o) => o.value === model.type) ?? {
            value: model.type,
            label: model.type,
          })
        : undefined,
      zoneId: model.zoneId
        ? {
            value: model.zoneId,
            label: model.zone?.name ?? String(model.zoneId),
          }
        : undefined,

      quantity: model.quantity ?? 1,
      isBookable: {
        value: !!model.isBookable as any,
        label: model.isBookable ? 'Sí' : 'No',
      },
      requiresApproval: {
        value: !!model.requiresApproval as any,
        label: model.requiresApproval ? 'Sí' : 'No',
      },
      minDurationMinutes: model.minDurationMinutes ?? undefined,
      maxDurationMinutes: model.maxDurationMinutes ?? undefined,
      bufferMinutes: model.bufferMinutes ?? undefined,

      description: model.description ?? '',
      image: model.image ?? '',
      icon: model.icon ?? '',
    };
    loading.value = false;
  }, [id]);

  const getAll = useCallback(async () => {
    loading.value = true;
    await Promise.all([getZones(), setInitialValues()]);
    loading.value = false;
  }, [getZones, setInitialValues]);

  useEffect(() => {
    if (selectedCompany) {
      getAll();
    }
  }, [selectedCompany, getAll]);

  const onSubmit = async (model: FormData) => {
    loading.value = true;
    // Guard extra: la zona seleccionada NO puede ser de tipo PARKING
    const selectedZoneId = Number(model.zoneId?.value);
    const selectedZone = rawZones.value.find((z) => z.id === selectedZoneId);
    if (!selectedZone) {
      ToastManager.error('s_select_valid_zone');
      return (loading.value = false);
    }
    if (String(selectedZone.type).toUpperCase() === 'PARKING') {
      ToastManager.error('s_zone_not_support_resources');
      return (loading.value = false);
    }

    const payload = {
      name: String(model.name).trim(),
      type: (model.type?.value as ResourceZoneType) ?? 'OTHER',
      zoneId: selectedZoneId,

      quantity: Number(model.quantity ?? 1),
      isBookable: !!(model.isBookable?.value as any),
      requiresApproval: !!(model.requiresApproval?.value as any),
      minDurationMinutes: Number.isFinite(model.minDurationMinutes)
        ? Number(model.minDurationMinutes)
        : undefined,
      maxDurationMinutes: Number.isFinite(model.maxDurationMinutes)
        ? Number(model.maxDurationMinutes)
        : undefined,
      bufferMinutes: Number.isFinite(model.bufferMinutes)
        ? Number(model.bufferMinutes)
        : undefined,

      description: model.description?.trim() || undefined,
      image: model.image?.trim() || undefined,
      icon: model.icon?.trim() || undefined,
    };

    const req = id
      ? await ResourceZoneService.updateResourceZone(Number(id), payload)
      : await ResourceZoneService.createResourceZone(payload);

    if (!req.getStatus()) return (loading.value = false);

    ToastManager.success(id ? 's_updated_success' : 's_created_success');
    go({
      to: '/trybook/resourcezone',
      label: 'resource-zones',
      id: 'trybook:resourcezone:state',
      base: 'setting',
    });
    loading.value = false;
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
          <form
            onSubmit={handleSubmit}
            className='space-y-6'
            id='form-resource-zone-create'
          >
            <StatusButton
              onClickClean={() => form.reset()}
              submitting={submitting || loading.value}
              pristine={pristine}
              form='form-resource-zone-create'
              label={id ? 'edit' : 'save'}
            />

            <div className='grid grid-cols-4 gap-2'>
              {/* Nombre */}
              <div className='col-span-2'>
                <Field<string> name='name' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      placeholder='p_enter_name'
                      label='l_name_resource'
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
                      label='l_type_resource'
                      id='type'
                      icon='tool'
                      options={TYPE_OPTIONS}
                      disabled={loading.value}
                    />
                  )}
                </Field>
              </div>

              {/* Zona común (filtrada != PARKING) */}
              <div className='col-span-2'>
                <Field<IOption> name='zoneId' validate={required}>
                  {({ input, meta }) => (
                    <SmartSelector
                      {...input}
                      meta={meta}
                      placeholder='p_zone'
                      label='h_common_area'
                      id='zoneId'
                      icon='map'
                      options={zones.value}
                      disabled={loading.value}
                    />
                  )}
                </Field>
              </div>

              {/* Cantidad */}
              <div className='col-span-2'>
                <Field<number> name='quantity'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      placeholder='p_quantity'
                      label='l_quantity'
                      type='number'
                      meta={meta}
                      onInput={(e: any) =>
                        input.onChange(Number(e.currentTarget.value))
                      }
                    />
                  )}
                </Field>
              </div>

              {/* Reservable */}
              <div className='col-span-2'>
                <Field<IOption> name='isBookable'>
                  {({ input, meta }) => (
                    <SmartSelector
                      {...input}
                      meta={meta}
                      placeholder='p_isBookable'
                      label='l_isBookable'
                      id='isBookable'
                      icon='calendar'
                      options={BOOL_OPTIONS}
                      disabled={loading.value}
                    />
                  )}
                </Field>
              </div>

              {/* Requiere aprobación */}
              <div className='col-span-2'>
                <Field<IOption> name='requiresApproval'>
                  {({ input, meta }) => (
                    <SmartSelector
                      {...input}
                      meta={meta}
                      placeholder='p_requiresApproval'
                      label='l_requiresApproval'
                      id='requiresApproval'
                      icon='shield'
                      options={BOOL_OPTIONS}
                      disabled={loading.value}
                    />
                  )}
                </Field>
              </div>

              {/* Min/Max duración y buffer */}
              <div className='col-span-2'>
                <Field<number> name='minDurationMinutes'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      placeholder='p_minDuration'
                      label='l_minDuration'
                      type='number'
                      meta={meta}
                      onInput={(e: any) =>
                        input.onChange(Number(e.currentTarget.value))
                      }
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-2'>
                <Field<number> name='maxDurationMinutes'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      placeholder='p_maxDuration'
                      label='l_maxDuration'
                      type='number'
                      meta={meta}
                      onInput={(e: any) =>
                        input.onChange(Number(e.currentTarget.value))
                      }
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-2'>
                <Field<number> name='bufferMinutes'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      placeholder='p_buffer'
                      label='l_buffer'
                      type='number'
                      meta={meta}
                      onInput={(e: any) =>
                        input.onChange(Number(e.currentTarget.value))
                      }
                    />
                  )}
                </Field>
              </div>

              {/* Descripción */}
              <div className='col-span-4'>
                <Field<string> name='description'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      placeholder='p_description_optional'
                      label='h_description'
                      type='text'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>

              {/* Imagen / Ícono */}
              <div className='col-span-2'>
                <Field<string> name='image'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      placeholder='p_image'
                      label='l_image'
                      type='text'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-2'>
                <Field<string> name='icon'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      placeholder='p_icon'
                      label='l_icon'
                      type='text'
                      meta={meta}
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
