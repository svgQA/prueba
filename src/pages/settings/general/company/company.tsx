// import { CreditCard, InvoiceCard } from '@/components/compose/cards';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { GeneralService } from '@/services/general';
import { ICompanyResponse } from '@/utils/types/company.interface';
import { useSignal } from '@preact/signals';
import { Card } from '@/components/common/card/card';
import { Button } from '@/components/common/button/button';

export const CompanySettingPage: FunctionComponent = () => {
  const companies = useSignal<ICompanyResponse[]>([]);
  // const selectedCompany = signal<IListResponse | null>(null);
  // const isEditing = signal(false);
  // const formData = signal<ICCompanyRequest>({
  //   name: '',
  //   description: '',
  //   address: '',
  //   phone: '',
  //   email: '',
  //   website: '',
  //   logo: ''
  // });

  useEffect(() => {
    document.title = 'Company Settings';
    loadCompanies();
    // loadCompanyOptions();
  }, []);

  const loadCompanies = async () => {
    try {
      const response = await GeneralService.getCompanies();
      if (!response.getStatus()) return;
      companies.value = response.getMany();
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  /*
  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    formData.value = {
      ...formData.value,
      [target.name]: target.value
    };
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    try {
      if (isEditing.value && selectedCompany.value) {
        await GeneralService.updateCompany(selectedCompany.value.id, formData.value as IUCompanyRequest);
      } else {
        await GeneralService.createCompany(formData.value);
      }
      loadCompanies();
      resetForm();
    } catch (error) {
      console.error('Error saving company:', error);
    }
  };

  const handleEdit = (company: IListResponse) => {
    selectedCompany.value = company;
    formData.value = {
      name: company.name,
      description: company.description,
      address: company.address || '',
      phone: company.phone || '',
      email: company.email || '',
      website: company.website || '',
      logo: company.logo || ''
    };
    isEditing.value = true;
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this company?')) {
      try {
        await GeneralService.deleteCompany(id);
        loadCompanies();
      } catch (error) {
        console.error('Error deleting company:', error);
      }
    }
  };
  
  const resetForm = () => {
    formData.value = {
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      logo: ''
    };
    selectedCompany.value = null;
    isEditing.value = false;
  };
  */

  return (
    <div className='h-full overflow-y-auto vox-scroll-design p-8 w-full'>
      <div className='flex flex-row gap-4 justify-center flex-wrap'>
        {companies.value.map((company) => (
          <Card key={company.id} name={`company-setting-${company.id}`}>
            <div className='p-6 min-w-[420px]'>
              {/* Header */}
              <div className='flex items-start justify-between mb-4'>
                <div className='flex-1'>
                  <h3 className='text-lg font-semibold truncate text-t-light dark:text-t-dark'>
                    {company.name}
                  </h3>
                  <p className='text-sm dark:text-gray-200 text-gray-800 mt-1'>
                    Created: {new Date(company.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className='flex space-x-2 ml-4'>
                  <Button name='company-setting-delete' icon='050' />
                  <Button name='company-setting-delete' icon='099' />
                </div>
              </div>

              {/* Description */}
              <p className='text-sm dark:text-gray-200 text-gray-800 mb-4 line-clamp-2'>
                {company.description}
              </p>

              {/* Contact Info */}
              <div className='space-y-2'>
                {company.address && (
                  <div className='flex items-start'>
                    <span className='vox-icon vx-icon-168 size-sm dark:text-gray-200 text-gray-800 mr-2' />
                    <span className='text-sm dark:text-gray-200 text-gray-800'>
                      {company.address}
                    </span>
                  </div>
                )}
                {company.phone && (
                  <div className='flex items-center'>
                    <span className='vox-icon vx-icon-168 size-sm dark:text-gray-200 text-gray-800 mr-2' />
                    <span className='text-sm dark:text-gray-200 text-gray-800'>
                      {company.phone}
                    </span>
                  </div>
                )}
                {company.email && (
                  <div className='flex items-center'>
                    <span className='vox-icon vx-icon-168 size-sm dark:text-gray-200 text-gray-800 mr-2' />
                    <span className='text-sm dark:text-gray-200 text-gray-800'>
                      {company.email}
                    </span>
                  </div>
                )}
                {company.website && (
                  <div className='flex items-center'>
                    <span className='vox-icon vx-icon-168 size-sm dark:text-gray-200 text-gray-800 mr-2' />
                    <a
                      href={company.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-indigo-600 hover:text-indigo-900 hover:underline'
                    >
                      {company.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className='mt-4 pt-4 border-t border-gray-100'>
                <div className='flex items-center justify-between text-xs dark:text-gray-200 text-gray-800'>
                  <span>ID: {company.externalId}</span>
                  <span>
                    Last updated:{' '}
                    {new Date(company.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
