import { ICompany } from '@/store/slices/interface';
import { memo } from 'preact/compat';

interface ICompanyItem {
  company: ICompany;
  setCompanySelected: (id: string) => void;
}

export const CompanyItem = memo<ICompanyItem>(
  ({ company, setCompanySelected }: ICompanyItem) => (
    <div
      key={company.id}
      className={`flex rounded-md cursor-pointer w-full px-4 py-2 flex-row justify-between items-center ${company.selected ? 'bg-primary' : 'bg-b-light dark:bg-b-dark'}`}
      onClick={() => setCompanySelected(company.id)}
    >
      <div>
        <h4>{company.name}</h4>
        <div className='flex flex-col'>
          <span>{company.role}</span>
          <span className='text-sm text-gray-500'>
            {company.identification}
          </span>
        </div>
      </div>
      <span className='vx-icon vx-users' />
    </div>
  )
);
