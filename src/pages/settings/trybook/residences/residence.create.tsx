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
import { CompanyService } from '@/services/general/company';
import { SitesService } from '@/services/trybook/sites';
import { ISiteCreate } from '@/types/trybook/sites';

type SiteType = 'HOUSE' | 'APARTMENT' | 'OFFICE';

interface FormData {
  type?: IOption; // { value: 'HOUSE'|'APARTMENT'|'OFFICE' }
  houseNumber: string;
  block?: string;
  floor?: number;
  placeId?: IOption; // { value, label, type: 'INDUSTRIAL'|'RESIDENTIAL' }
  clientCompanyId?: IOption; // requerido si OFFICE
  userId?: IOption; // NO TOCAR
}

const TYPE_OPTIONS: IOption[] = [
  { value: 'HOUSE', label: 'Casa' },
  { value: 'APARTMENT', label: 'Apartamento' },
  { value: 'OFFICE', label: 'Oficina' },
];

/** Asegura que cada opción tenga `.type` plano (sin usar meta) */
const normalizePlaces = (arr: IOption[]): IOption[] =>
  (arr || []).map((o: any) => ({ ...o, type: o?.type }));

/** Usa SOLO option.type */
const isIndustrialOpt = (opt?: IOption | null) =>
  !!opt && (opt as any).type === 'INDUSTRIAL';

export const SiteCreatePage: FunctionComponent = () => {
  const { go } = useNavigation();
  const { uuid } = useParams<{ uuid?: string }>();
  const { selectedCompany } = useUserStore();

  // data
  const allPlaces: Signal<IOption[]> = useSignal([]);
  const places: Signal<IOption[]> = useSignal([]); // FILTRADAS para el selector activo
  const users: Signal<IOption[]> = useSignal([]);
  const clients: Signal<IOption[]> = useSignal([]);

  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const loading = useSignal<boolean>(false);

  // --- loaders ---
  const loadAllPlaces = useCallback(async () => {
    const req = await PlaceService.getSimpleList();
    if (req.getStatus()) {
      allPlaces.value = normalizePlaces(req.getMany());
      // por defecto (no oficina) dejamos residenciales
      places.value = allPlaces.value.filter(
        (p: any) => p.type === 'RESIDENTIAL'
      );
    }
  }, []);

  const loadUsers = useCallback(async () => {
    const req = await UserService.getListUsers();
    if (req.getStatus()) users.value = req.getMany();
  }, []);

  const loadClients = useCallback(async () => {
    const req = await CompanyService.getClientsSimple();
    if (req.getStatus()) clients.value = req.getMany();
  }, []);

  const loadClientPlaces = useCallback(async (clientId: number) => {
    const req = await PlaceService.getSimpleListByClient(clientId);
    console.log(req);
    if (req.getStatus()) {
      places.value = normalizePlaces(req.getMany()).filter(
        (p: any) => p.type === 'INDUSTRIAL'
      );
      return;
    }
    // fallback: si algo falla, no mostramos nada (mejor que mezclar residenciales)
    places.value = [];
  }, []);

  const setInitialValues = useCallback(async () => {
    if (!uuid) return;
    const req = await SitesService.getSite(uuid);
    if (!req.getStatus()) return;
    const model = req.getOne();

    // si es OFFICE, primero cargar places del cliente (industriales)
    if (model.type === 'OFFICE' && (model as any)?.clientCompanyId) {
      await loadClientPlaces(Number((model as any).clientCompanyId));
    }

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
            type: (model as any)?.place?.type, // viene directo del backend
          }
        : undefined,
      clientCompanyId: (model as any)?.clientCompanyId
        ? {
            value: (model as any).clientCompanyId,
            label:
              (model as any).clientCompany?.name ??
              String((model as any).clientCompanyId),
          }
        : undefined,
      // NO TOCAR user
      userId: (model as any)?.userId
        ? {
            value: (model as any).userId,
            label: (model as any).user?.name ?? String((model as any).userId),
          }
        : undefined,
    };
  }, [uuid, loadClientPlaces]);

  const bootstrap = useCallback(async () => {
    loading.value = true;
    await Promise.all([loadAllPlaces(), loadUsers(), loadClients()]);
    await setInitialValues();
    loading.value = false;
  }, [loadAllPlaces, loadUsers, loadClients, setInitialValues]);

  useEffect(() => {
    if (selectedCompany) bootstrap();
  }, [selectedCompany, bootstrap]);

  // --- submit ---
  const onSubmit = async (model: FormData) => {
    const selectedType = (model.type?.value as SiteType) ?? 'HOUSE';

    // Reglas de oficina vs residenciales (solo con .type)
    if (selectedType === 'OFFICE') {
      if (!model.clientCompanyId?.value) {
        ToastManager.error('Selecciona la Empresa cliente.');
        return;
      }
      if (!isIndustrialOpt(model.placeId)) {
        ToastManager.error(
          'Debes seleccionar un Place INDUSTRIAL del cliente.'
        );
        return;
      }
    } else {
      if (isIndustrialOpt(model.placeId)) {
        ToastManager.error(
          'Para Casa/Apartamento el Place debe ser RESIDENTIAL.'
        );
        return;
      }
    }

    const payload: ISiteCreate = {
      type: selectedType,
      houseNumber: String(model.houseNumber).trim(),
      block: model.block?.trim() || undefined,
      floor:
        selectedType === 'APARTMENT'
          ? Number.isFinite(model.floor)
            ? Number(model.floor)
            : 0
          : 0,
      placeId: Number(model.placeId?.value),
      ...(selectedType === 'OFFICE'
        ? { clientCompanyId: Number(model.clientCompanyId!.value) }
        : {}),
      // NO TOCAR
      userId: Number(model.userId?.value),
    };

    const req = uuid
      ? await SitesService.updateSite(uuid, payload)
      : await SitesService.createSite(payload);

    if (!req.getStatus()) return;

    ToastManager.success(uuid ? 's_updated_success' : 's_created_success');
    go({
      to: '/trybook/sites',
      label: 'sites',
      id: 'trybook:sites:state',
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
          const isOffice = values.type?.value === 'OFFICE';

          // Cuando cambia TYPE, actualizamos la lista de places a partir de .type
          const handleTypeChange = async (opt?: IOption) => {
            form.change('type', opt);
            form.change('placeId', undefined);
            form.change('clientCompanyId', undefined);

            if (opt?.value === 'OFFICE') {
              // Espera cliente para cargar places industriales
              places.value = [];
            } else {
              // Solo residenciales
              places.value = allPlaces.value.filter(
                (p: any) => p.type === 'RESIDENTIAL'
              );
            }
          };

          // Cuando cambia CLIENTE, cargamos lugares industriales de ese cliente
          const handleClientChange = async (opt?: IOption) => {
            form.change('clientCompanyId', opt);
            form.change('placeId', undefined);
            if (opt?.value) {
              await loadClientPlaces(Number(opt.value));
            } else {
              places.value = [];
            }
          };

          const placeDisabled = isOffice
            ? !values.clientCompanyId?.value
            : false;

          return (
            <form
              onSubmit={handleSubmit}
              className='space-y-6'
              id='form-site-create'
            >
              <StatusButton
                onClickClean={() => form.reset()}
                submitting={submitting || loading.value}
                pristine={pristine}
                form='form-site-create'
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
                        placeholder='p_select_type'
                        label='Tipo de sitio'
                        id='type'
                        icon='home'
                        options={TYPE_OPTIONS}
                        disabled={loading.value}
                        onChange={handleTypeChange}
                      />
                    )}
                  </Field>
                </div>

                {/* Bloque */}
                <div className='col-span-2'>
                  <Field<string> name='block'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder='p_block'
                        label='l_block'
                        type='text'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>

                {/* Piso (solo APARTMENT) */}
                <div className='col-span-2'>
                  <Field<number> name='floor'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder='p_floor'
                        label='l_floor'
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

                {/* Número */}
                <div className='col-span-2'>
                  <Field<string> name='houseNumber' validate={required}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder='p_houseNumber'
                        label={
                          isOffice
                            ? 'Código/Número de oficina'
                            : 'l_houseNumber'
                        }
                        type='text'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>

                {/* Cliente (solo OFFICE) */}
                {isOffice && (
                  <div className='col-span-2'>
                    <Field<IOption> name='clientCompanyId' validate={required}>
                      {({ input, meta }) => (
                        <SmartSelector
                          {...input}
                          meta={meta}
                          placeholder='p_client_company'
                          label='Empresa cliente'
                          id='clientCompanyId'
                          icon='building'
                          options={clients.value}
                          disabled={loading.value}
                          onChange={handleClientChange}
                        />
                      )}
                    </Field>
                  </div>
                )}

                {/* Place (en OFFICE se habilita tras cliente) */}
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
                        disabled={loading.value || placeDisabled}
                      />
                    )}
                  </Field>
                </div>

                {/* Usuario (NO TOCAR) */}
                <div className='col-span-2'>
                  <Field<IOption> name='userId' validate={required}>
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        meta={meta}
                        placeholder='p_user'
                        label='l_user'
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
