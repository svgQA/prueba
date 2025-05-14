import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Form, Field } from 'react-final-form';
import { required } from '@/utils/utilities';
import { validateEmail, validateCardId } from '@/utils/validators';
import { composeValidators } from '@/utils/validators';
import { IUserRequest, IUserResponse } from '@/types/auth';
import { UserService } from '@/services/general/user';
import { getUserMode, USER_MODE_SERVICE } from '../store/user.store';
import { Input } from '@/components/common/input/input';
import {
  ICountryResponse,
  IDocumentTypeResponse,
} from '@/types/user/user.response';
import {
  IDepartmentResponse,
  IMunicipalityResponse,
} from '@/types/shift/shift.response';
import { Signal, useSignal } from '@preact/signals';
import { Select } from '@/components/common/select/select';
import { File } from '@/components/common/file/file';
import { ToastManager } from '@/utils/toast/toast-manager';
import { IPresignedRequest } from '@/types/file';
import { CompanyService, PlaceService } from '@/services';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { IOption } from '@/components/common/multi/interface';
import { AreaService } from '@/services/general/area';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { t } from 'i18next';

interface CreateUserProps {
  onUserCreated?: (user: any) => void;
  user?: IUserResponse;
}

export const CreateUser: FunctionComponent<CreateUserProps> = (props: CreateUserProps) => {
  const documentTypes = useSignal<IDocumentTypeResponse[]>([]);
  const countries = useSignal<ICountryResponse[]>([]);
  const departments = useSignal<IDepartmentResponse[]>([]);
  const municipalities = useSignal<IMunicipalityResponse[]>([]);
  const companies = useSignal<IOption[]>([]);
  const allCompanies = useSignal<IOption[]>([]);
  const initialValues: Signal<Partial<IUserRequest>> = useSignal({});
  const image = useSignal<IPresignedRequest[]>([]);
  const areas = useSignal<IOption[]>([]);

  useEffect(() => {
    // applyAllData();
    getInitialValues();
    getCompanies();
    getDocumentTypes();
    getCountries();
    getDepartments();
    getAllCompanies();
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
        externalId: user.externalId,
        externalPlatformId: user.externalPlatformId,
        companyId: user.companyId || user.companies?.[0]?.company?.id,
        companies: user.companies?.map(comp => ({
          label: comp.company.name,
          value: comp.company.id
        })) || [],
        extraData: {
          area: user.extraData?.area || '',
          city: user.extraData?.city || '',
          country: user.extraData?.country || '',
          state: user.extraData?.state || '',
          sucursal: user.extraData?.sucursal || '',
          // TODO: Validar si es necesario
          job: user.extraData?.job || '',
          company: user.extraData?.company || ''
        }
      };

      if (user.companies?.[0]?.company?.id) {
        await getAreas(user.companies[0].company.id.toString());
      }

      if (user.extraData?.state) {
        // Primero cargamos los departamentos para asegurarnos que estén disponibles
        await getDepartments();
        const department = departments.value.find(
          (department) => department.name === user.extraData?.state
        );
        if (department?.id) {
          await getMunicipalities(department.id);
        }
      }

      getUserMode.value.mode = USER_MODE_SERVICE.UPDATE;
    } else {
      initialValues.value = {
        name: '',
        surname: '',
        email: '',
        phone: '',
        cardType: '',
        cardId: '',
        address: '',
        userType: 'USER',
        externalId: '',
        externalPlatformId: '',
        companyId: 1,
        companies: [],
        extraData: {
          country: '',
          state: '',
          city: '',
          area: '',
          sucursal: '',
          job: '',
          company: ''
        }
      };
      getUserMode.value.mode = USER_MODE_SERVICE.CREATE;
    }
  };

  const getCountries = async (): Promise<void> => {
    const response = await UserService.getCountries();
    if (!response.getStatus()) return;
    countries.value = response.getMany();
  };

  const getDepartments = async (): Promise<void> => {
    const response = await PlaceService.getDepartments();
    if (!response.getStatus()) return;
    departments.value = response.getMany();
  };

  const getCompanies = async (): Promise<void> => {
    const response = await CompanyService.getCompanyList();
    if (!response.getStatus()) return;
    const r_companies = response.getMany();
    companies.value = r_companies;
  };

  const getAllCompanies = async (): Promise<void> => {
    const response = await CompanyService.getCompanies();
    if (!response.getStatus()) return;
    allCompanies.value = response.getMany().map(company => ({
      label: company.name,
      value: company.id
    }));
  };

  const getAreas = async (company: string): Promise<void> => {
    const id = parseInt(company);
    const response = await AreaService.getArea(id);
    if (!response.getStatus()) return;
    areas.value = response.getMany();
  };

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
    const response = await PlaceService.getMunicipalities(departmentId);
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

    user.companyId = Number(user.companyId || 1);

    if (getUserMode.value.mode === USER_MODE_SERVICE.UPDATE && user.id) {
      request = await UserService.update(user, user.id);
    } else {
      request = await UserService.create(user);
    }
    if (!request.getStatus()) return;
    props.onUserCreated?.(request.getOne());

    ToastManager.success(message);
  };

  const onClean = () => {
    initialValues.value = {
      name: '',
      surname: '',
      email: '',
      phone: '',
      cardType: '',
      cognitoId: '',
      companies: [],
      extraData: {
        country: '',
        state: '',
        city: '',
        area: '',
        job: '',
        sucursal: '',
        company: ''
      }
    };
    companies.value = [];
    areas.value = [];
    municipalities.value = [];
    departments.value = [];
    countries.value = [];
  }

  return (
    <Form
      initialValues={initialValues.value}
      onSubmit={onSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className='p-4' id='user-form'>
          <div className='grid grid-cols-2 gap-4 py-3'>
            <Field<string> name='name' validate={required}>
              {({ input, meta }) => (
                <Input
                  {...input}
                  placeholder='Ingrese el nombre...'
                  label='Nombre'
                  type='text'
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
                  meta={meta}
                  normal
                />
              )}
            </Field>

            <Field<string> name='phone' validate={composeValidators(required)}>
              {({ input, meta }) => (
                <Input
                  {...input}
                  placeholder='Ingrese el teléfono...'
                  label='Teléfono'
                  type='tel'
                  meta={meta}
                  normal
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    input.onChange(
                      value.startsWith('+57') ? value : `+57${value}`
                    );
                  }}
                />
              )}
            </Field>
            <Field<string> name='cardType' validate={required}>
              {({ input, meta }) => (
                <Select
                  {...input}
                  placeholder='Seleccione tipo de documento...'
                  label='Tipo de documento'
                  name='cardType'
                  icon=''
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
                  meta={meta}
                />
              )}
            </Field>

            <Field<string> name='address' validate={required}>
              {({ input, meta }) => (
                <Input
                  {...input}
                  placeholder='Dirección'
                  label='Dirección'
                  type='text'
                  meta={meta}
                />
              )}
            </Field>

            <Field<string> name='userType' validate={required}>
              {({ input, meta }) => (
                <Select
                  {...input}
                  placeholder='Seleccione tipo de usuario...'
                  label='Tipo de usuario'
                  name='userType'
                  icon=''
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

            <Field<string>
              name='externalId'
              validate={(value) => {
                if (!value) return undefined;
                if (value.length < 5)
                  return 'El código externo debe tener al menos 5 caracteres';
                return undefined;
              }}
            >
              {({ input, meta }) => (
                <Input
                  {...input}
                  placeholder='Ingrese el código externo...'
                  label='Código externo'
                  type='text'
                  meta={meta}
                />
              )}
            </Field>

            <Field<string>
              name='externalPlatformId'
              validate={(value) => {
                if (!value) return undefined;
                if (value.length < 5)
                  return 'El código de plataforma externa debe tener al menos 5 caracteres';
                return undefined;
              }}
            >
              {({ input, meta }) => (
                <Input
                  {...input}
                  placeholder='Ingrese plataforma externa...'
                  label='Plataforma externa'
                  type='text'
                  meta={meta}
                />
              )}
            </Field>

            <Field<string> name='extraData.country' validate={required}>
              {({ input, meta }) => (
                <Select
                  {...input}
                  placeholder='Seleccione país...'
                  label='País'
                  name='country'
                  icon='012'
                  optionValue='name'
                  optionLabel='name'
                  options={countries.value}
                  meta={meta}
                />
              )}
            </Field>

            <Field<string> name='companyId' validate={required}>
              {({ input, meta }) => (
                <Select
                  {...input}
                  placeholder='Seleccione empresa...'
                  id='company'
                  label='Empresa'
                  name='company'
                  icon='123'
                  options={companies.value}
                  meta={meta}
                  value={props.user?.companies?.[0]?.company?.id?.toString()}
                  onChange={(e) => {
                    const id = e.currentTarget.value;
                    if (id) {
                      getAreas(id);
                    }
                    input.onChange(id);
                  }}
                />
              )}
            </Field>

            <Field<string> name='extraData.state' validate={required}>
              {({ input, meta }) => (
                <Select
                  {...input}
                  placeholder='Seleccione Departamento...'
                  id='departmentId'
                  label='Departamento'
                  name='departmentId'
                  icon=''
                  optionValue='name'
                  optionLabel='name'
                  options={departments.value}
                  onChange={(e) => {
                    const name = e.currentTarget.value;
                    const department = departments.value.find(
                      (department) => department.name === name
                    );
                    if (department?.id) {
                      onChangeDepartment(department.id);
                    }
                    input.onChange(department?.name);
                  }}
                  meta={meta}
                />
              )}
            </Field>

            <Field<string> name='extraData.city' validate={required}>
              {({ input, meta }) => (
                <Select
                  {...input}
                  placeholder='Seleccione Ciudad...'
                  label='Municipio'
                  id='municipalityId'
                  name='municipalityId'
                  icon=''
                  optionValue='name'
                  optionLabel='name'
                  options={municipalities.value}
                  meta={meta}
                />
              )}
            </Field>

            <Field<string> name='extraData.area' validate={required}>
              {({ input, meta }) => (
                <Select
                  {...input}
                  placeholder='Seleccione area...'
                  id='area'
                  label='Area'
                  name='area'
                  icon='045'
                  options={areas.value}
                  meta={meta}
                  value={props.user?.extraData?.area}
                />
              )}
            </Field>

            <Field<string> name='extraData.sucursal'>
              {({ input, meta }) => (
                <Input
                  {...input}
                  placeholder='Ingrese la sucursal...'
                  label='Sucursal'
                  type='text'
                  meta={meta}
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
            <Field<IOption[]> name='companies' validate={required}>
              {({ input, meta }) => (
                <SmartSelector
                  {...input}
                  meta={meta}
                  name='companies'
                  id='select-companies'
                  label='Empresa'
                  options={allCompanies.value}
                  multiple={true}
                  allowAll={true}
                  menuPortalTarget={document.body}
                  placeholder={t(
                    'form.placeholder.company'
                  )}
                  onChange={() => {}}
                />
              )}
            </Field>
            {/* <pre>{JSON.stringify(image.value, null, 2)}</pre> */}
          </div>
          <StatusButton
            onClickClean={onClean}
            submitting={false}
            pristine={false}
            form='user-form'
          />
        </form>
      )}
    />
  );
};
