import { Table } from '@/components/common/table/table';
import { useUserStore } from '@/store/slices';
import { IReportResponse } from '@/types/form';
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { getColumns } from './components/report.columns';
import { IRowAction } from '@/components/common/table/interface';
import { ReportService } from '@/services/form/reports';
// import { useLocation } from 'wouter';
// import { PdfmeEditor } from './components/PdfmeEditor';

export const FormReportSettingPage = () => {
  const { t } = useTranslation();
  const report = useSignal<IReportResponse[]>([]);
  // const [_, navigate] = useLocation();
  const loading = useSignal<boolean>(false);

  useEffect(() => {
    document.title = t('p_form');
  }, []);

  const { selectedCompany } = useUserStore();

  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      fetchInitialData();
    }
  }, [selectedCompany, location]);

  const fetchInitialData = async () => {
    loading.value = true;
    const [responseReport] = await Promise.all([ReportService.get_report_all()]);

    if (responseReport.getStatus()) {
      report.value = responseReport.getMany();
    }

    loading.value = false;
  }

  const handleOnClick = async (_action: IRowAction) => { }

  return (
    <>
      {/*<Section>
       <PdfmeEditor /> 
    </Section>*/}
      <Table<IReportResponse>
        data={report.value}
        columns={getColumns(handleOnClick)}
        pageSize={10}
        onClickAction={handleOnClick}
        isSettingTable
        loading={loading.value}
        absolute
        visibility={{
          category: false,
        }}
      />
    </>
  );
};
