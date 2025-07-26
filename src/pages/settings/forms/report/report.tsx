import { Table } from '@/components/common/table/table';
import { useUserStore } from '@/store/slices';
import { IReportResponse } from '@/types/form';
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { getColumns } from './components/report.columns';
import { IRowAction } from '@/components/common/table/interface';
import { ReportService } from '@/services/form/reports';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useNavigation } from '@/utils/hooks/navigation';

// import { PdfmeEditor } from './components/PdfmeEditor';

export const FormReportSettingPage = () => {
  const { t } = useTranslation();
  const report = useSignal<IReportResponse[]>([]);
  const { go } = useNavigation();
  const loading = useSignal<boolean>(false);
  const { selectedCompany } = useUserStore();

  useEffect(() => {
    document.title = t('p_form');
  }, []);

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

  const editReport = (id: number) => {
    go({
      to: `/forms/report/update/${id}`,
      label: 'update',
      id: 'forms:form:state:update',
      base: 'setting',
    });
  }

  const deleteReport = async (id: number) => {
    const response = await ReportService.delete_report(id);
    if (!response.getStatus()) return;
    fetchInitialData();
  }

  const handleOnClick = async (action: IRowAction) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        editReport(Number(action.id));
        break;
      case ROW_ACTIONS.DELETE:
        deleteReport(Number(action.id));
        break;
    }
  }

  return (
    <>
      {/*<Section> <PdfmeEditor /> </Section>*/}
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
