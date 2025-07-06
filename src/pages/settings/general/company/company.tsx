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
import { Section } from '@/components/common/section/section';
import { useTranslation } from 'react-i18next';

export const CompanySettingPage: FunctionComponent = () => {
  const { setCompanies } = useUserStore();

  const companies = useSignal<ICompanyResponse[]>([]);
  const showForm = useSignal(false);
  const isEditing = useSignal(false);
  const selectedCompany = useSignal<ICompanyResponse | null>(null);

  const initialFormValues: ICCompanyRequest = {
    name: '',
    description: '',
    address: '',
    identification: '',
  };
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_setting');
    loadCompanies();
  }, []);

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
    resetForm(true, true, company);
  };

  // const handleAdd = () => {
  //   resetForm(!showForm.value);
  // };

  const resetForm = (
    show: boolean = false,
    isEdit: boolean = false,
    company: ICompanyResponse | null = null
  ) => {
    selectedCompany.value = company;
    isEditing.value = isEdit;
    showForm.value = show;
  };

  const onSubmit = async (values: ICCompanyRequest | IUCompanyRequest) => {
    let response;
    if (isEditing && selectedCompany.value) {
      response = await CompanyService.updateCompany(
        selectedCompany.value.id,
        values as IUCompanyRequest
      );
    } else {
      response = await CompanyService.createCompany(values as ICCompanyRequest);
    }
    if (!response.getStatus()) return;
    ToastManager.success(isEditing ? 's_updated_success' : 's_created_success');
    resetForm(false);
    loadCompanies();
  };

  return (
    <Section className='pt-2'>
      <div className='h-full overflow-y-auto vox-scroll-design p-5 w-full relative pt-16'>
        <div className='flex flex-row justify-between'>
          <div className='flex flex-row gap-2 justify-center flex-wrap'>
            {companies.value.map((company) => (
              <CardCompany
                key={company.id}
                company={company}
                onEdit={() => handleEdit(company)}
              />
            ))}
          </div>
          <div className='min-w-[500px] bg-white dark:bg-b-dark-dark p-4 rounded shadow m-2'>
            <Form<ICCompanyRequest | IUCompanyRequest>
              onSubmit={onSubmit}
              initialValues={
                selectedCompany.value
                  ? {
                      name: selectedCompany.value?.name,
                      description: selectedCompany.value?.description,
                      address: selectedCompany.value?.address || '',
                      identification:
                        selectedCompany.value?.identification || '',
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
                <form
                  onSubmit={handleSubmit}
                  className='h-full flex flex-col justify-between'
                  id='form-company'
                >
                  <div className='flex flex-col justify-between gap-4'>
                    <h2 className='text-2xl font-bold'>
                      {isEditing ? 'Editar Empresa' : 'Nueva Empresa'}
                    </h2>
                    <div className='grid grid-cols-2 gap-4'>
                      <Field<string> name='name'>
                        {({ input, meta }) => (
                          <Input
                            {...input}
                            id='name'
                            name='name'
                            label='Nombre'
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
                            label='Identificación (NIT)'
                            meta={meta}
                            type='text'
                          />
                        )}
                      </Field>
                      <Field<string> name='description'>
                        {({ input, meta }) => (
                          <Input
                            {...input}
                            id='description'
                            name='description'
                            label='Descripción'
                            meta={meta}
                            type='text'
                          />
                        )}
                      </Field>
                      <Field<string> name='address'>
                        {({ input, meta }) => (
                          <Input
                            {...input}
                            id='address'
                            name='address'
                            label='Dirección'
                            meta={meta}
                            type='text'
                          />
                        )}
                      </Field>
                    </div>
                  </div>
                  <StatusButton
                    onClickClean={() => {
                      form.reset();
                      if (isEditing) {
                        resetForm(false);
                      }
                    }}
                    submitting={submitting}
                    pristine={pristine}
                    form='form-company'
                  />
                </form>
              )}
            />
          </div>
        </div>
      </div>
    </Section>
  );
};
