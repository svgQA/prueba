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
  zoneId?: IOption; 
  code: string;
  isOccupied?: IOption; 
}

const OCCUPIED_OPTIONS: IOption[] = [
  { value: 0, label: 'Libre' },
  { value: 1, label: 'Ocupado' },
];

export const CommonSlotCreatetPage: FunctionComponent = () => {
  const { go } = useNavigation();
  const { uuid } = useParams<{ uuid?: string }>(); 
  const { selectedCompany } = useUserStore();

  const zones: Signal<IOption[]> = useSignal([]);
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const loading = useSignal<boolean>(false);

  useEffect(() => {
    document.title = 'Espacios (Common Slots)';
  }, []);

  const getZones = useCallback(async () => {
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
  const setInitialValues = useCallback(async () => {
    loading.value = true;
    if (!uuid) return (loading.value = false);
    const req = await CommonSlotService.getSlot(uuid);
    if (!req.getStatus()) return (loading.value = false);

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
    loading.value = false;
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
    loading.value = true;
    const payload = {
      zoneId: Number(model.zoneId?.value),
      code: String(model.code || '').trim(),
      isOccupied: Boolean(model.isOccupied?.value),
    };
    if (!payload.zoneId || !payload.code) return;

    const req = uuid
      ? await CommonSlotService.updateSlot(uuid, payload as any)
      : await CommonSlotService.createSlot(payload as any);

    if (!req.getStatus()) return (loading.value = false);

    ToastManager.success(uuid ? 's_updated_success' : 's_created_success');
    go({
      to: '/trybook/commonslot',
      label: 'common-slots',
      id: 'trybook:common-slot:state',
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
              <div className='col-span-2'>
                <Field<IOption> name='zoneId' validate={required}>
                  {({ input, meta }) => (
                    <SmartSelector
                      {...input}
                      meta={meta}
                      placeholder='p_zone'
                      label='l_zone'
                      id='zoneId'
                      icon='layers'
                      options={zones.value}
                      disabled={loading.value}
                    />
                  )}
                </Field>
              </div>
              <div className='col-span-2'>
                <Field<string> name='code' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      placeholder='p_code_ticket'
                      label='l_code_ticket'
                      type='text'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>
              <div className='col-span-2'>
                <Field<IOption> name='isOccupied'>
                  {({ input, meta }) => (
                    <SmartSelector
                      {...input}
                      meta={meta}
                      placeholder='p_select_state'
                      label='l_status'
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
