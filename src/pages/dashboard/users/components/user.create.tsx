import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Form, Field } from 'react-final-form';
import { required, validateOption, validatePhone } from '@/utils/utilities';
import { validateEmail, validateCardId } from '@/utils/validators';
import { composeValidators } from '@/utils/validators';
import { type IUserRequest, type IUserResponse } from '@/types/auth';
import { UserService } from '@/services/general/user';
import { getUserMode, USER_MODE_SERVICE } from '../store/user.store';
import { Input } from '@/components/common/input/input';
import {
  // ICountryResponse,
  type IDocumentTypeResponse,
} from '@/types/user/user.response';
// import {
//   IDepartmentResponse,
//   IMunicipalityResponse,
// } from '@/types/shift/shift.response';
import { Signal, useSignal } from '@preact/signals';
import { Select } from '@/components/common/select/select';
import { File } from '@/components/common/file/file';
import { ToastManager } from '@/utils/toast/toast-manager';
import { type IPresignedRequest } from '@/types/file';
import { CompanyService, PlaceService } from '@/services';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { type IOption } from '@/components/common/multi/interface';
// import { AreaService } from '@/services/general/area';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { t } from 'i18next';
import { RoleService } from '@/services/general/role';
import { useUserStore } from '@/store/slices';
import { useTranslation } from 'react-i18next';
interface CreateUserProps {
  onUserCreated?: (user: any) => void;
  user?: IUserResponse;
}
const DOCUMENT_TYPE_TRANSLATIONS: Record<string, string> = {
  'Cédula de ciudadanía': 'l_citizenship_id',
  'Tarjeta de identidad': 'l_identity_card',
  'Registro civil': 'l_civil_registry',
  'Tarjeta de extranjería': 'l_foreign_id_card',
  'Cédula de extranjería': 'l_foreign_citizenship_id',
  Pasaporte: 'l_passport',
  'Permiso especial de permanencia': 'l_special_permit',
  'Permiso por protección temporal': 'l_temporary_protection_permit',
  'Documento de identificación extranjero': 'l_foreign_identification_document',
};
const translateDocumentType = (name: string): string => {
  const translationKey = DOCUMENT_TYPE_TRANSLATIONS[name];
  return translationKey ? t(`users.documentTypes.${translationKey}`) : name;
};

export const CreateUser: FunctionComponent<CreateUserProps> = (props) => {
  const {} = useUserStore();

  const documentTypes = useSignal<IDocumentTypeResponse[]>([]);
  const roles = useSignal<IOption[]>([]);
  const places = useSignal<IOption[]>([]);
  // const countries = useSignal<ICountryResponse[]>([]);
  // const departments = useSignal<IDepartmentResponse[]>([]);
  // const municipalities = useSignal<IMunicipalityResponse[]>([]);
  // const allCompanies = useSignal<IOption[]>([]);

  const countries = useSignal<IOption[]>([]);
  const departments = useSignal<IOption[]>([]);
  const municipalities = useSignal<IOption[]>([]);
  const companies = useSignal<IOption[]>([]);
  const areas = useSignal<IOption[]>([]);
  const clients = useSignal<IOption[]>([]);
  const initialValues: Signal<Partial<IUserRequest>> = useSignal({});
  const image = useSignal<IPresignedRequest[]>([]);
  const requiredRole = useSignal<boolean>(true);
  const typeSelected = useSignal<string | null>(null);
  const rawDocumentTypes = useSignal<IDocumentTypeResponse[]>([]);
  const { i18n } = useTranslation();

  useEffect(() => {
    // applyAllData();
    Promise.all([
      getInitialValues(),
      getDocumentTypes(),
      getCountries(),
      getCompanies(),
      getDepartments(),
      getRoles(),
      getPlaces(),
      getClients(),
    ]);
    // getCompanies();
    // getDepartments();
    // getAllCompanies();
  }, []);

  useEffect(() => {
    if (rawDocumentTypes.value.length > 0) {
      documentTypes.value = rawDocumentTypes.value.map((docType) => ({
        ...docType,
        name: translateDocumentType(docType.name),
      }));
    }
  }, [i18n.language]);

  // const applyAllData = async (): Promise<void> => {
  //   await Promise.all([
  //     getInitialValues(),
  //     getCompanies(),
  //     getDocumentTypes(),
  //     getCountries(),
  //     getDepartments(),
  //   ]);
  // };

  const getInitialValues = async (): Promise<void> => {
    if (props.user) {
      const user = props.user;
      const roles = user.roles?.map((role) => ({
        label: role.role.name,
        value: role.role.id,
      }));

      const places = user.userPlaces?.map((place) => ({
        label: place.place.name,
        value: place.place.id,
      }));

      const userClients = user.clients?.map((client) => ({
        label: client.client.name,
        value: client.client.id,
      }));

      const userCompanies =
        user.companies?.map((comp) => ({
          label: comp.company.name,
          value: comp.company.id,
        })) || [];

      const userExtraData = {
        // area: user.extraData?.area || '',
        city: user.extraData?.city?.label ? user.extraData?.city : undefined,
        country: user.extraData?.country?.label
          ? user.extraData?.country
          : undefined,
        state: user.extraData?.state?.label ? user.extraData?.state : undefined,

        sucursal: user.extraData?.sucursal,
        job: user.extraData?.job,
      };

      initialValues.value = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        cardType: user.cardType,
        cardId: user.cardId,
        address: user.address,
        userType: user.userType,
        // externalId: user.externalId,
        // externalPlatformId: user.externalPlatformId,
        companies: userCompanies,
        extraData: userExtraData,
        roles: roles,
        places: places,
        clients: userClients,
      };

      if (user.userType) typeSelected.value = user.userType;

      // TODO: Luego validar las areas porque estas dependend
      // de cada empresa por eso debe ser un objeto mas general que esa area
      // que se seleccione quede asociada a la empresa.
      /*
      if (user.companies?.[0]?.company?.id) {
        await getAreas(user.companies[0].company.id.toString());
      }
      */

      if (user.extraData?.state) {
        await getDepartments();
        const stateLabel = user.extraData?.state?.label;
        const department = departments.value.findIndex(
          (department) => department.label === stateLabel
        );
        if (department >= 0) {
          const departmentId = Number(departments.value[department].value);
          await getMunicipalities(departmentId);
        }
      }

      getUserMode.value.mode = USER_MODE_SERVICE.UPDATE;
    } else {
      cleanInitialValues();
      getUserMode.value.mode = USER_MODE_SERVICE.CREATE;
    }
  };

  const getCountries = async (): Promise<void> => {
    const response = await PlaceService.getCountriesList();
    if (!response.getStatus()) return;
    countries.value = response.getMany();
  };

  const getClients = async (): Promise<void> => {
    const response = await UserService.getClients();
    if (!response.getStatus()) return;
    clients.value = response.getMany().map((client) => ({
      label: client.name,
      value: client.id,
    }));
  };

  const getDepartments = async (): Promise<void> => {
    const response = await PlaceService.getDepartmentList(
      1 // TODO: @Estaban esto es el id de colombia.
    );
    if (!response.getStatus()) return;
    departments.value = response.getMany();
  };

  const getCompanies = async (): Promise<void> => {
    const response = await CompanyService.getCompanyList();
    if (!response.getStatus()) return;
    const r_companies = response.getMany();
    companies.value = r_companies;
  };

  const getRoles = async (): Promise<void> => {
    const response = await RoleService.getRoles();
    if (!response.getStatus()) return;

    roles.value = response.getMany().map((role) => ({
      label: role.name,
      value: role.id,
    }));
  };

  const getPlaces = async () => {
    const response = await PlaceService.getSimpleList();
    if (!response.getStatus()) return;
    places.value = response.getMany();
  };

  // TODO: @Estaban el solo debe asignar a las que tiene acceso,
  // No puede ser a todas las empresas.
  /*
  const getAllCompanies = async (): Promise<void> => {
    const response = await CompanyService.getCompanies();
    if (!response.getStatus()) return;
    allCompanies.value = response.getMany()
    .map((company) => ({
      label: company.name,
      value: company.id,
    }));
  };
  */

  /*
  const getAreas = async (company: string): Promise<void> => {
    const id = Number(company);
    const response = await AreaService.getAreaList(id);
    if (!response.getStatus()) return;
    areas.value = response.getMany();
  };
  */

  const onChangeDepartment = async (departmentId: number) => {
    await getMunicipalities(departmentId);
  };

  // const findDepartmentByName = (
  //   name: string | undefined
  // ): IDepartmentResponse => {
  //   const department = departments.value.find(
  //     (department) => department.name === name
  //   );

  //   if (!department) {
  //     throw new Error(`department with name ${name} not found`);
  //   }
  //   return department;
  // };

  const getMunicipalities = async (departmentId: number): Promise<void> => {
    const response = await PlaceService.getMunicipalitieList(departmentId);
    if (!response.getStatus()) return;
    municipalities.value = response.getMany();
  };

  const getDocumentTypes = async (): Promise<void> => {
    const response = await UserService.getDocumentTypes();
    if (!response.getStatus()) return;

    const types = response.getMany();

    rawDocumentTypes.value = types;

    documentTypes.value = types.map((docType) => ({
      ...docType,
      name: translateDocumentType(docType.name),
    }));
  };

  const onSubmit = async (user: IUserRequest) => {
    let request;
    let message = '';

    if (user.id) {
      request = await UserService.update(user, user.id);
      message = 's_updated_success';
    } else {
      request = await UserService.create(user);
      message = 's_created_success';
    }

    if (!request.getStatus()) return;
    props.onUserCreated?.(request.getOne());

    ToastManager.success(message);
  };

  const onClean = () => {
    cleanInitialValues();
    companies.value = [];
    areas.value = [];
    municipalities.value = [];
    departments.value = [];
    countries.value = [];
    clients.value = [];
  };

  const cleanInitialValues = () => {
    initialValues.value = {
      name: '',
      surname: '',
      email: '',
      phone: '',
      cardType: '',
      // cognitoId: '',
      companies: [],
      extraData: {
        country: undefined,
        state: undefined,
        city: undefined,
        area: undefined,
        job: undefined,
        sucursal: undefined,
      },
    };
  };

  const getTypesUsers = (): { id: string; name: string }[] => {
    /*return [
      ...(user?.userType === 'ADMIN_CLIENT'
        ? [
            {
              id: 'CLIENT',
              name: t('l_client'),
            },
          ]
        : [
            {
              id: 'USER',
              name: t('l_operator'),
            },
            {
              id: 'ADMIN',
              name: t('l_administrator'),
            },
            {
              id: 'CLIENT',
              name: t('l_client'),
            },
            {
              id: 'ADMIN_CLIENT',
              name: t('l_admin_client'),
            },
          ]),
    ];*/

    return [
      {
        id: 'INTERNAL',
        name: t('l_internal'),
      },
      {
        id: 'EXTERNAL_ACCESS',
        name: t('l_external_access'),
      },
    ];
  };

  return (
    <div className='flex flex-col pt-16'>
      <StatusButton
        onClickClean={onClean}
        submitting={false}
        pristine={false}
        form='user-form'
        className='!top-2'
        label={
          getUserMode.value.mode === USER_MODE_SERVICE.CREATE
            ? 'save'
            : 'update'
        }
      />

      <Form
        initialValues={initialValues.value}
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} id='user-form'>
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
              {/* Información Personal */}
              <div className='bg-b-light-light dark:bg-b-dark-light p-4 rounded-lg shadow-sm'>
                <h3 className='text-lg font-semibold mb-4 border-b border-b-light dark:border-b-dark pb-2'>
                  {t('h_personal_info')}
                </h3>
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                  <Field<string> name='name' validate={required}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder='l_name'
                        label='l_name'
                        type='text'
                        icon='174'
                        meta={meta}
                      />
                    )}
                  </Field>

                  <Field<string> name='surname' validate={required}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder='l_surname'
                        label='l_surname'
                        type='text'
                        icon='174'
                        meta={meta}
                      />
                    )}
                  </Field>

                  <Field<string>
                    name='email'
                    validate={composeValidators(required, validateEmail)}
                  >
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder='p_email'
                        label='l_email'
                        type='email'
                        icon='100'
                        meta={meta}
                        normal
                      />
                    )}
                  </Field>

                  <Field<string>
                    name='phone'
                    validate={composeValidators(required, validatePhone)}
                  >
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder={'h_phone'}
                        label={'h_phone'}
                        type='tel'
                        meta={meta}
                        icon='402'
                        normal
                        onChange={(e) => {
                          const value = e.currentTarget.value;
                          input.onChange(
                            value.startsWith('+') ? value : `+${value}`
                          );
                        }}
                      />
                    )}
                  </Field>
                </div>
              </div>

              {/* Información de Documento */}
              <div className='bg-b-light-light dark:bg-b-dark-light p-4 rounded-lg shadow-sm'>
                <h3 className='text-lg font-semibold mb-4 border-b border-b-light dark:border-b-dark pb-2'>
                  {t('h_doc_info')}
                </h3>
                <div className='grid grid-cols-1 gap-4'>
                  <Field<string> name='cardType' validate={required}>
                    {({ input, meta }) => (
                      <Select
                        {...input}
                        placeholder='p_select_document_type'
                        label='l_card_type'
                        name='cardType'
                        icon='096'
                        optionValue='id'
                        optionLabel='name'
                        onChange={(e) => {
                          const id = parseInt(e.currentTarget.value);
                          input.onChange(id);
                        }}
                        options={documentTypes.value}
                        meta={meta}
                      />
                    )}
                  </Field>

                  <Field<string>
                    name='cardId'
                    validate={composeValidators(required, validateCardId)}
                  >
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder='p_enter_document_number'
                        label='l_card_id'
                        type='text'
                        icon='174'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>
              </div>

              {/* Información de Ubicación */}
              <div className='bg-b-light-light dark:bg-b-dark-light p-4 rounded-lg shadow-sm'>
                <h3 className='text-lg font-semibold mb-4 border-b border-b-light dark:border-b-dark pb-2'>
                  {t('h_location_info')}
                </h3>
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                  <Field<IOption>
                    name='extraData.country'
                    validate={validateOption}
                  >
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        meta={meta}
                        id='country'
                        label='h_country'
                        placeholder='p_select'
                        options={countries.value}
                      />
                    )}
                  </Field>

                  <Field<IOption>
                    name='extraData.state'
                    validate={validateOption}
                  >
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        meta={meta}
                        id='departmentId'
                        label='h_department'
                        placeholder='p_select'
                        options={departments.value}
                        onChange={(e) => {
                          if (e?.value) {
                            const id = Number(e.value);
                            onChangeDepartment(id);
                          }
                          input.onChange(e);
                        }}
                      />
                    )}
                  </Field>

                  <Field<IOption>
                    name='extraData.city'
                    validate={validateOption}
                  >
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        meta={meta}
                        id='municipalityId'
                        label='l_municipality'
                        placeholder='p_search'
                        options={municipalities.value}
                      />
                    )}
                  </Field>

                  <Field<string> name='address' validate={required}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder='p_address'
                        label='l_address'
                        icon='142'
                        type='text'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>
              </div>

              {/* Información de Usuario */}
              <div className='bg-b-light-light dark:bg-b-dark-light p-4 rounded-lg shadow-sm'>
                <h3 className='text-lg font-semibold mb-4 border-b border-b-light dark:border-b-dark pb-2'>
                  {t('h_user_info')}
                </h3>

                <div className='grid grid-cols-1 gap-4'>
                  <Field<string> name='userType' validate={required}>
                    {({ input, meta }) => (
                      <Select
                        {...input}
                        placeholder='p_select_user_type'
                        label='l_user_type'
                        name='userType'
                        icon='096'
                        onChange={(e) => {
                          requiredRole.value =
                            e.currentTarget.value !== 'CLIENT';
                          input.onChange(e);
                          typeSelected.value = e.currentTarget.value;
                        }}
                        optionValue='id'
                        optionLabel='name'
                        options={getTypesUsers()}
                        meta={meta}
                      />
                    )}
                  </Field>
                  {typeSelected.value === 'EXTERNAL_ACCESS' && (
                    <div className='grid grid-cols-1 gap-4'>
                      <Field<IOption> name='clients'>
                        {({ input, meta }) => (
                          <SmartSelector
                            {...input}
                            meta={meta}
                            id='clients'
                            label='l_client'
                            placeholder='p_select'
                            icon='096'
                            multiple={true}
                            allowAll={true}
                            options={clients.value}
                          />
                        )}
                      </Field>
                    </div>
                  )}
                  {typeSelected.value === 'ADMIN_CLIENT' ||
                    (typeSelected.value === 'CLIENT' && (
                      <Field<IOption[]>
                        name='places'
                        validate={requiredRole.value ? required : undefined}
                      >
                        {({ input, meta }) => (
                          <SmartSelector
                            {...input}
                            meta={meta}
                            id='select-places'
                            label={t('h_place')}
                            options={places.value}
                            multiple={true}
                            allowAll={true}
                            menuPortalTarget={document.body}
                            placeholder={t('h_place')}
                            onChange={() => {}}
                          />
                        )}
                      </Field>
                    ))}
                  <Field<IOption[]>
                    name='roles'
                    validate={requiredRole.value ? required : undefined}
                  >
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        meta={meta}
                        id='select-roles'
                        label='l_role'
                        icon='096'
                        options={roles.value}
                        multiple={true}
                        allowAll={true}
                        menuPortalTarget={document.body}
                        placeholder='p_select_role'
                        onChange={() => {}}
                      />
                    )}
                  </Field>

                  <Field<IOption[]> name='companies' validate={required}>
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        meta={meta}
                        id='select-companies'
                        label='l_company'
                        icon='023'
                        options={companies.value}
                        multiple={true}
                        allowAll={true}
                        menuPortalTarget={document.body}
                        placeholder='p_company'
                        onChange={() => {}}
                      />
                    )}
                  </Field>
                  <File
                    name='extraData.image'
                    onChange={(e) => {
                      image.value = e.target.value;
                    }}
                    value={image.value}
                    label='l_image'
                    accept='image/*'
                  />
                </div>
              </div>
            </div>
          </form>
        )}
      />
    </div>
  );
};
