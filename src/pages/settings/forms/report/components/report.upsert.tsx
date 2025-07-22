import { useEffect, useState } from 'preact/hooks';
import { ReportService } from '@/services/form/reports';
import { IReportResponse } from '@/types/form/service';

// Extraer el formulario real a un componente aparte
import ReportUpsertForm from './report.upsert.form';

const ReportUpsertPage = ({ params }: { params: { id?: string } }) => {
  const [initialData, setInitialData] = useState<Partial<IReportResponse>>({});
  const [loading, setLoading] = useState(!!params.id);

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      ReportService.get_report_by_id(Number(params.id)).then(res => {
        if (res.getStatus()) setInitialData(res.getOne());
        setLoading(false);
      });
    }
  }, [params.id]);

  if (loading) return <div>Loading...</div>;

  return <ReportUpsertForm initialData={initialData} />;
};

export default ReportUpsertPage; 