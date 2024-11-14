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
      className={`flex cursor-pointer w-full px-4 py-2 mb-1 flex-row justify-between items-center ${company.selected ? 'bg-primary' : ''}`}
      onClick={() => setCompanySelected(company.id)}
    >
      <div>
        <h4>{company.name}</h4>
        <span>{company.role}</span>
      </div>
      <span className='vx-icon vx-users' />
    </div>
  )
);
