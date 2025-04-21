// import { CreditCard, InvoiceCard } from '@/components/compose/cards';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { GeneralService } from '@/services/general';
import { ICompanyResponse } from '@/utils/types/company.interface';
import { useSignal } from '@preact/signals';

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
    <div className='container h-full overflow-y-auto vox-scroll-design p-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {companies.value.map((company) => (
          <div
            key={company.id}
            className='bg-white rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors duration-200'
          >
            <div className='p-6'>
              {/* Header */}
              <div className='flex items-start justify-between mb-4'>
                <div className='flex-1'>
                  <h3 className='text-lg font-semibold text-gray-900 truncate'>
                    {company.name}
                  </h3>
                  <p className='text-sm text-gray-500 mt-1'>
                    Created: {new Date(company.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className='flex space-x-2 ml-4'>
                  <button
                    className='p-1 text-gray-400 hover:text-indigo-600 transition-colors'
                    title='Edit'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                      />
                    </svg>
                  </button>
                  <button
                    className='p-1 text-gray-400 hover:text-red-600 transition-colors'
                    title='Delete'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className='text-sm text-gray-600 mb-4 line-clamp-2'>
                {company.description}
              </p>

              {/* Contact Info */}
              <div className='space-y-2'>
                {company.address && (
                  <div className='flex items-start'>
                    <svg
                      className='w-5 h-5 text-gray-400 mt-0.5 mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                    </svg>
                    <span className='text-sm text-gray-600'>
                      {company.address}
                    </span>
                  </div>
                )}
                {company.phone && (
                  <div className='flex items-center'>
                    <svg
                      className='w-5 h-5 text-gray-400 mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                      />
                    </svg>
                    <span className='text-sm text-gray-600'>
                      {company.phone}
                    </span>
                  </div>
                )}
                {company.email && (
                  <div className='flex items-center'>
                    <svg
                      className='w-5 h-5 text-gray-400 mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                      />
                    </svg>
                    <span className='text-sm text-gray-600'>
                      {company.email}
                    </span>
                  </div>
                )}
                {company.website && (
                  <div className='flex items-center'>
                    <svg
                      className='w-5 h-5 text-gray-400 mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
                      />
                    </svg>
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
                <div className='flex items-center justify-between text-xs text-gray-500'>
                  <span>ID: {company.externalId}</span>
                  <span>
                    Last updated:{' '}
                    {new Date(company.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
