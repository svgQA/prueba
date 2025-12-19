// import { CreditCard, InvoiceCard } from '@/components/compose/cards';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { ICompanyResponse } from '@/utils/types/company.interface';
import { useSignal } from '@preact/signals';
import { CompanyService } from '@/services';
import { CardCompany } from './component/card.company';
import { Form, Field } from 'react-final-form';
import { Input } from '@/components/common/input/input';
import { ToastManager } from '@/utils/toast/toast-manager';
import { StatusButton } from '../../components/custom.button';
import {
  ICCompanyRequest,
  IUCompanyRequest,
} from '@/utils/types/company.interface';
import { useUserStore } from '@/store/slices/access/user.slice';
// import { Section } from '@/components/common/section/section';
import { useTranslation } from 'react-i18next';

export const CompanySettingPage: FunctionComponent = () => {
  const { setCompanies } = useUserStore();

  const companies = useSignal<ICompanyResponse[]>([]);
  const showForm = useSignal(false);
  const isEditing = useSignal(false);
  const _selectedCompany = useSignal<ICompanyResponse | null>(null);

  const initialFormValues: ICCompanyRequest = {
    name: '',
    description: '',
    address: '',
    identification: '',
  };
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('p_setting');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      loadCompanies();
    }
  }, [selectedCompany, location]);

  const loadCompanies = async () => {
    const [responseGeneral, responseList] = await Promise.all([
      CompanyService.getCompanies(),
      CompanyService.getCompanyList(),
    ]);
    if (responseGeneral.getStatus()) {
      companies.value = responseGeneral.getMany();
    }
    if (responseList.getStatus()) {
      const list = responseList.getMany();
      if (list.length > 0) {
        setCompanies(list);
      }
    }
  };

  const handleEdit = (company: ICompanyResponse) => {
    company.id === _selectedCompany.value?.id
      ? resetForm(true, false, null)
      : resetForm(true, true, company);
  };

  const resetForm = (
    show: boolean = false,
    isEdit: boolean = false,
    company: ICompanyResponse | null = null
  ) => {
    _selectedCompany.value = company;
    isEditing.value = isEdit;
    showForm.value = show;
  };

  const onSubmit = async (
    values: ICCompanyRequest | IUCompanyRequest,
    form?: any
  ) => {
    let response;
    if (isEditing && _selectedCompany.value) {
      response = await CompanyService.updateCompany(
        _selectedCompany.value.id,
        values as IUCompanyRequest
      );
    } else {
      response = await CompanyService.createCompany(values as ICCompanyRequest);
    }
    if (!response.getStatus()) return;
    ToastManager.success(isEditing ? 's_updated_success' : 's_created_success');
    resetForm(false);
    form.reset();
    loadCompanies();
  };

  return (
    <div className='grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-2 items-start'>
      <section className='min-w-0'>
        <div className='vox-scroll-design max-h-[68vh] overflow-y-auto'>
          <div className='grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-y-4 gap-x-2 p-2'>
            {companies.value.map((company) => (
              <CardCompany
                key={company.id}
                company={company}
                selected={company.id === _selectedCompany.value?.id}
                onEdit={() => handleEdit(company)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <aside className='rounded-lg border border-b-light-dark dark:border-b-dark-light bg-b-light dark:bg-b-dark-dark'>
        <Form<ICCompanyRequest | IUCompanyRequest>
          onSubmit={onSubmit}
          initialValues={
            _selectedCompany.value
              ? {
                  name: _selectedCompany.value?.name,
                  description: _selectedCompany.value?.description,
                  address: _selectedCompany.value?.address || '',
                  identification: _selectedCompany.value?.identification || '',
                }
              : initialFormValues
          }
          validate={(values) => {
            const errors: Partial<ICCompanyRequest> = {};
            if (!values.name || values.name.length < 4)
              errors.name = 'Nombre requerido (mínimo 4 caracteres)';
            if (!values.description)
              errors.description = 'Descripción requerida';
            if (!values.address) errors.address = 'Dirección requerida';
            if (!values.identification || values.identification.length < 3)
              errors.identification =
                'Identificación requerida (mínimo 3 caracteres)';
            return errors;
          }}
          render={({ handleSubmit, form, submitting, pristine }) => (
            <form onSubmit={handleSubmit} id='form-company' className='p-5'>
              <StatusButton
                onClickClean={() => {
                  form.reset();
                  if (isEditing) resetForm(false);
                }}
                clear
                lock={!isEditing.value}
                submitting={submitting}
                pristine={pristine}
                form='form-company'
                hasClean
              />

              <div className='flex items-start justify-between gap-4 mb-5'>
                <h2 className='text-xl font-semibold capitalize'>
                  {isEditing.value ? t('edit') : t('create')}
                </h2>
              </div>

              {/* Campos: 1 columna en móvil, 2 en sm+, con gaps más grandes */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                <Field<string> name='name'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      id='name'
                      name='name'
                      label='h_name'
                      meta={meta}
                      type='text'
                    />
                  )}
                </Field>

                <Field<string> name='identification'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      id='identification'
                      label='h_identification'
                      meta={meta}
                      type='text'
                    />
                  )}
                </Field>

                <div className='sm:col-span-2'>
                  <Field<string> name='description'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        id='description'
                        name='description'
                        label='h_description'
                        meta={meta}
                        type='text'
                      />
                    )}
                  </Field>
                </div>

                <div className='sm:col-span-2'>
                  <Field<string> name='address'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        id='address'
                        name='address'
                        label='h_address'
                        meta={meta}
                        type='text'
                      />
                    )}
                  </Field>
                </div>
              </div>
            </form>
          )}
        />
      </aside>
    </div>
  );
};
