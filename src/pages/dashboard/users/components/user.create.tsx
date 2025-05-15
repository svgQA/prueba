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

interface CreateUserProps {
  onUserCreated?: (user: any) => void;
  user?: IUserResponse;
}

export const CreateUser: FunctionComponent<CreateUserProps> = (props) => {
  const documentTypes = useSignal<IDocumentTypeResponse[]>([]);
  // const countries = useSignal<ICountryResponse[]>([]);
  // const departments = useSignal<IDepartmentResponse[]>([]);
  // const municipalities = useSignal<IMunicipalityResponse[]>([]);
  // const allCompanies = useSignal<IOption[]>([]);

  const countries = useSignal<IOption[]>([]);
  const departments = useSignal<IOption[]>([]);
  const municipalities = useSignal<IOption[]>([]);
  const companies = useSignal<IOption[]>([]);
  const areas = useSignal<IOption[]>([]);

  const initialValues: Signal<Partial<IUserRequest>> = useSignal({});
  const image = useSignal<IPresignedRequest[]>([]);

  useEffect(() => {
    // applyAllData();
    Promise.all([
      getInitialValues(),
      getDocumentTypes(),
      getCountries(),
      getCompanies(),
      getDepartments(),
    ]);
    // getCompanies();
    // getDepartments();
    // getAllCompanies();
  }, []);

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
      };

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
    documentTypes.value = response.getMany();
  };

  const onSubmit = async (user: IUserRequest) => {
    let request;
    let message =
      getUserMode.value.mode === USER_MODE_SERVICE.UPDATE
        ? 'Usuario actualizado'
        : 'Usuario creado';

    if (getUserMode.value.mode === USER_MODE_SERVICE.UPDATE && user.id) {
      request = await UserService.update(user, user.id);
    } else if (getUserMode.value.mode === USER_MODE_SERVICE.CREATE) {
      request = await UserService.create(user);
    } else return;

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

  return (
    <div className='flex flex-col'>
      <div className='absolute top-0 right-0 flex items-center justify-center bg-red gap-10 flex-row'>
        <h2 className='text-2xl font-bold mt-3 pb-2 w-full text-start'>
          {getUserMode.value.mode === USER_MODE_SERVICE.CREATE
            ? 'Crear usuario'
            : 'Editar usuario'}
        </h2>
        <StatusButton
          onClickClean={onClean}
          submitting={false}
          pristine={false}
          form='user-form'
        />
      </div>

      <Form
        initialValues={initialValues.value}
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} id='user-form'>
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
              {/* Información Personal */}
              <div className='bg-b-light-light dark:bg-b-dark-light p-4 rounded-lg shadow-sm'>
                <h3 className='text-lg font-semibold mb-4 border-b border-b-light dark:border-b-dark pb-2'>
                  Información Personal
                </h3>
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                  <Field<string> name='name' validate={required}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder='Ingrese el nombre...'
                        label='Nombre'
                        type='text'
                        icon='231'
                        meta={meta}
                      />
                    )}
                  </Field>

                  <Field<string> name='surname' validate={required}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder='Ingrese el apellido...'
                        label='Apellido'
                        type='text'
                        icon='231'
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
                        placeholder='Ingrese el email...'
                        label='Email'
                        type='email'
                        icon='231'
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
                        placeholder='Ingrese el teléfono...'
                        label='Teléfono'
                        type='tel'
                        meta={meta}
                        icon='231'
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
                  Información de Documento
                </h3>
                <div className='grid grid-cols-1 gap-4'>
                  <Field<string> name='cardType' validate={required}>
                    {({ input, meta }) => (
                      <Select
                        {...input}
                        placeholder='Seleccione tipo de documento...'
                        label='Tipo de documento'
                        name='cardType'
                        icon='231'
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
                        placeholder='Ingrese el numero de documento...'
                        label='Numero de documento'
                        type='text'
                        icon='231'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>
              </div>

              {/* Información de Ubicación */}
              <div className='bg-b-light-light dark:bg-b-dark-light p-4 rounded-lg shadow-sm'>
                <h3 className='text-lg font-semibold mb-4 border-b border-b-light dark:border-b-dark pb-2'>
                  Información de Ubicación
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
                        label='País'
                        icon='321'
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
                        label='Departamento'
                        icon='321'
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
                        label='Municipio'
                        icon='321'
                        options={municipalities.value}
                      />
                    )}
                  </Field>

                  <Field<string> name='address' validate={required}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder='Dirección'
                        label='Dirección'
                        icon='321'
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
                  Información de Usuario
                </h3>
                <div className='grid grid-cols-1 gap-4'>
                  <Field<string> name='userType' validate={required}>
                    {({ input, meta }) => (
                      <Select
                        {...input}
                        placeholder='Seleccione tipo de usuario...'
                        label='Tipo de usuario'
                        name='userType'
                        icon='231'
                        optionValue='id'
                        optionLabel='name'
                        options={[
                          { id: 'USER', name: 'Operador' },
                          { id: 'ADMIN', name: 'Administrador' },
                          { id: 'CLIENT', name: 'Cliente' },
                        ]}
                        meta={meta}
                      />
                    )}
                  </Field>

                  <Field<IOption[]> name='companies' validate={required}>
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        meta={meta}
                        id='select-companies'
                        label='Empresa'
                        icon='231'
                        options={companies.value}
                        multiple={true}
                        allowAll={true}
                        menuPortalTarget={document.body}
                        placeholder={t('form.placeholder.company')}
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
                    label='Imagen'
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
