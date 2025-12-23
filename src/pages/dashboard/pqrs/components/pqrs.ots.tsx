import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';

import { Section } from '@/components/common/section/section';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';

import { OtsService } from '@/services/pqrs/ots';

import { getColumns } from './pqrs-ots.columns';
import { ICOtsRequest } from '../utils/interface';
import { useUserStore } from '@/store/slices';

// 1. IMPORTAR LA LIBRERÍA DE TRADUCCIÓN
import { useTranslation } from 'react-i18next';

const OtsPage = () => {
  // 2. OBTENER LA FUNCIÓN 't'
  const { t } = useTranslation();
  
  const { selectedCompany } = useUserStore();

  const pqrsOts = useSignal<ICOtsRequest[]>([]);
  const loading = useSignal<boolean>(false);

  useEffect(() => {
    if (selectedCompany) {
      fetchInitialData();
    }
  }, [selectedCompany]);

  const fetchInitialData = async () => {
    loading.value = true;
    const [responseOts] = await Promise.all([OtsService.get_all()]);
    if (!responseOts.getStatus()) return (loading.value = false);
    pqrsOts.value = responseOts.getMany();
    loading.value = false;
  };

  const onClickAction = (_: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => {
    // console.log('Acción seleccionada:', params);
    // Aquí abres modales, haces navigations, etc.
  };

  return (
    <Section className='mr-3 my-1 relative' padding={true}>
      <div className='max-h-screen relative'>
        <Table<ICOtsRequest>
          data={pqrsOts.value}
          // 3. PASAR 't' COMO PRIMER ARGUMENTO
          columns={getColumns(t, onClickAction)} 
          showExpandableIcon
          selectable
          loading={loading.value}
        />
      </div>
    </Section>
  );
};

export default OtsPage;