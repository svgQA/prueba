// CommonSlotUpsertPage.tsx
import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { useEffect, useCallback } from 'preact/hooks';
import { useParams } from 'wouter';

import { required } from '@/utils/utilities';
import { Section } from '@/components/common/section/section';
import { Input } from '@/components/common/input/input';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { IOption } from '@/components/common/multi/interface';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useNavigation } from '@/utils/hooks/navigation';
import { useUserStore } from '@/store/slices';

import { CommonZoneService } from '@/services/trybook/commonzone';
import { CommonSlotService } from '@/services/trybook/comonslot';

interface FormData {
  zoneId?: IOption; // { value: number, label: string }
  code: string;
  isOccupied?: IOption; // { value: 1|0, label: string }
}

const OCCUPIED_OPTIONS: IOption[] = [
  { value: 0, label: 'Libre' },
  { value: 1, label: 'Ocupado' },
];

export const CommonSlotCreatetPage: FunctionComponent = () => {
  const { go } = useNavigation();
  const { uuid } = useParams<{ uuid?: string }>(); // UUID del slot
  const { selectedCompany } = useUserStore();

  const zones: Signal<IOption[]> = useSignal([]);
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const loading = useSignal<boolean>(false);

  useEffect(() => {
    document.title = 'Espacios (Common Slots)';
  }, []);

  // Cargar zonas para el selector
  const getZones = useCallback(async () => {
    // puedes pasar paginación si tu servicio lo requiere
    const req = await CommonZoneService.getCommonZones({
      page: 1,
      items: 1000,
    } as any);
    if (!req.getStatus()) return;

    const rows = req.getMany?.() ?? [];
    zones.value = rows.map((z: any) => ({
      value: z.id,
      label: z.name ?? `Zona #${z.id}`,
    }));
  }, []);

  // Setear valores iniciales en modo edición
  const setInitialValues = useCallback(async () => {
    if (!uuid) return;
    const req = await CommonSlotService.getSlot(uuid);
    if (!req.getStatus()) return;

    const model = req.getOne();
    initialValues.value = {
      zoneId: model.zoneId
        ? {
            value: model.zoneId,
            label: model.zone?.name ?? String(model.zoneId),
          }
        : undefined,
      code: model.code ?? '',
      isOccupied:
        typeof model.isOccupied === 'boolean'
          ? model.isOccupied
            ? OCCUPIED_OPTIONS[1]
            : OCCUPIED_OPTIONS[0]
          : OCCUPIED_OPTIONS[0],
    };
  }, [uuid]);

  const getAll = useCallback(async () => {
    loading.value = true;
    await getZones();
    await setInitialValues();
    loading.value = false;
  }, [getZones, setInitialValues]);

  useEffect(() => {
    if (selectedCompany) getAll();
  }, [selectedCompany, getAll]);

  const onSubmit = async (model: FormData) => {
    const payload = {
      zoneId: Number(model.zoneId?.value),
      code: String(model.code || '').trim(),
      isOccupied: Boolean(model.isOccupied?.value), // 1 -> true, 0 -> false
    };

    // saneo mínimo
    if (!payload.zoneId || !payload.code) return;

    const req = uuid
      ? await CommonSlotService.updateSlot(uuid, payload as any)
      : await CommonSlotService.createSlot(payload as any);

    if (!req.getStatus()) return;

    ToastManager.success(uuid ? 's_updated_success' : 's_created_success');
    go({
      to: '/trybook/commonslot',
      label: 'common-slots',
      id: 'trybook:common-slot:state',
      base: 'setting',
    });
  };

  return (
    <Section className='p-4 space-y-2 max-h-[67vh] overflow-y-auto vox-scroll-design'>
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues.value}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form
            onSubmit={handleSubmit}
            className='space-y-6'
            id='form-common-slot-upsert'
          >
            <StatusButton
              onClickClean={() => form.reset()}
              submitting={submitting || loading.value}
              pristine={pristine}
              form='form-common-slot-upsert'
              label={uuid ? 'edit' : 'save'}
            />

            <div className='grid grid-cols-4 gap-2'>
              {/* Zona común */}
              <div className='col-span-2'>
                <Field<IOption> name='zoneId' validate={required}>
                  {({ input, meta }) => (
                    <SmartSelector
                      {...input}
                      meta={meta}
                      placeholder='trybook.commonslot.placeholder.zone'
                      label='trybook.commonslot.form.zone'
                      id='zoneId'
                      icon='layers'
                      options={zones.value}
                      disabled={loading.value}
                    />
                  )}
                </Field>
              </div>

              {/* Código del slot */}
              <div className='col-span-2'>
                <Field<string> name='code' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      placeholder='trybook.commonslot.placeholder.code'
                      label='trybook.commonslot.form.code'
                      type='text'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>

              {/* Estado de ocupación */}
              <div className='col-span-2'>
                <Field<IOption> name='isOccupied'>
                  {({ input, meta }) => (
                    <SmartSelector
                      {...input}
                      meta={meta}
                      placeholder='trybook.commonslot.placeholder.status'
                      label='trybook.commonslot.form.status'
                      id='isOccupied'
                      icon='toggle-right'
                      options={OCCUPIED_OPTIONS}
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
