import { FormService, IResponseSummary } from '@/services';
import { IResponseResponse } from '@/types/form';
import { useSignal } from '@preact/signals';
import { type FunctionComponent } from 'preact';
import { useCallback, useEffect, useMemo } from 'preact/hooks';
import { Section } from '@/components/common/section/section';
import { CardData } from '@/components/compose/cards';
import { Table } from '@/components/common/table/table';
import { IRowAction } from '@/components/common/table/interface';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { getColumns } from './components/inspect.columns';
import { useTranslation } from 'react-i18next';
import { ToastManager } from '@/utils/toast/toast-manager';
import { Button } from '@/components/common/button/button';
import { FormResponseSettingPage } from './response/response';
import {
  RESPONSE_MODE_SERVICE,
  setResponse,
  VIEW_NAME,
  currentView,
} from './response/store/response';
import { validateResponse } from '@/pages/settings/forms/response/store/response';
import { useUserStore } from '@/store/slices';
import { defaultSummary } from '../memos/memos.page';

export const FormsPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const responses = useSignal<IResponseResponse[]>([]);
  const loading = useSignal<boolean>(false);
  const { selectedCompany } = useUserStore();
  const summary = useSignal<IResponseSummary>(defaultSummary);

  useEffect(() => {
    document.title = t('p_form');
  }, []);

  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      getResponseHandler();
    }
  }, [selectedCompany, location]);

  const getResponseHandler = async () => {
    loading.value = true;
    const [responseForm, responseSummary] = await Promise.all([
      FormService.get_response_all(),
      FormService.get_response_summary(),
    ]);

    if (responseForm.getStatus()){
      responses.value = responseForm.getMany();
    };

    if(responseSummary.getStatus()){
      summary.value = responseSummary.getOne();
    }

    loading.value = false;
  };

  const handleOnClick = async (action: IRowAction) => {
    const response = responses.value.find(
      (response) => response.id == action.id
    );

    if (!response?.structure) {
      ToastManager.error('s_not_exist');
      return;
    }

    if (!validateResponse(response.structure)) {
      ToastManager.error('s_structure_error');
      return;
    }

    switch (action.action) {
      case ROW_ACTIONS.RESPONSE: {
        setResponse(
          { mode: RESPONSE_MODE_SERVICE.UPDATE, id: response.id },
          response.structure
        );
        handleViewChange(VIEW_NAME.INSPECT);
        break;
      }
      case ROW_ACTIONS.DELETE: {
        const respons = await FormService.remove_response_one(response.id);
        if (!respons.getStatus()) return;
        getResponseHandler();
        break;
      }
      case ROW_ACTIONS.REPORT: {
        setResponse(
          { mode: RESPONSE_MODE_SERVICE.UPDATE, id: response.id, hold: true },
          response.structure
        );
        handleViewChange(VIEW_NAME.REPORT);
        break;
      }
      default: {
        ToastManager.error('s_not_exist');
      }
    }
  };

  const handlePosFinishAction = () => {
    getResponseHandler();
    handleViewChange(VIEW_NAME.TABLE);
  };

  const handleViewChange = useCallback((view: VIEW_NAME) => {
    currentView.value = view;
  }, []);

  const buttonMenu = useMemo(
    () => (
      <div className='flex items-center gap-2'>
        <Button
          name='button-change-table'
          onClick={() => {
            handleViewChange(VIEW_NAME.TABLE);
          }}
          selected={currentView.value === VIEW_NAME.TABLE}
          icon='092'
        />
        <Button
          name='button-change-scheduler'
          // onClick={() => {
          //   handleViewChange(VIEW_NAME.INSPECT);
          // }}
          disabled
          selected={currentView.value === VIEW_NAME.INSPECT}
          icon='418'
        />
        {/*
        <Button
          name='button-change-report'
          onClick={() => {
            handleViewChange(VIEW_NAME.REPORT);
          }}
          selected={currentView.value === VIEW_NAME.REPORT}
          icon='012'
        /> */}
      </div>
    ),
    [currentView.value]
  );

  /**
   *
   * @param summary
   * @param isResolve
   * @returns
   */
  const calculatePercentage = (
    summary: IResponseSummary,
    isResolve: boolean = false
  ): string => {
    const inProgress = summary.in_progress || 0;
    const completed = summary.completed || 0;
    const total = inProgress + completed;
    if (total === 0) return '0%';
    const value = isResolve ? completed : inProgress;
    return `${Math.round((value / total) * 100)}%`;
  };

  return (
    <Section padding>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardData
          title={t('forms.cards.total')}
          count={summary.value.total}
          subtitle={t('forms.cards.subtitle')}
          color='t-dark'
          icon='328'
        />

        <CardData
          title={t('forms.cards.active')}
          count={calculatePercentage(summary.value)}
          subtitle={t('forms.cards.activeSubtitle')}
          color='t-dark'
          icon='311'
        />

        <CardData
          title={t('forms.cards.archived')}
          count={calculatePercentage(summary.value, true)}
          subtitle={t('forms.cards.archivedSubtitle')}
          color='t-dark'
          icon='312'
        />
      </div>

      <div className='max-h-screen'>
        <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-10 bg-b-content dark:bg-b-dark'>
          <div className='flex flex-row items-center justify-between'>
            {buttonMenu}
          </div>
        </div>
        {currentView.value === VIEW_NAME.TABLE && (
          <Table<IResponseResponse>
            data={responses.value}
            columns={getColumns(handleOnClick)}
            pageSize={20}
            onClickAction={handleOnClick}
            loading={loading.value}
          />
        )}
        {(currentView.value === VIEW_NAME.INSPECT ||
          currentView.value === VIEW_NAME.REPORT) && (
          <div className='max-h-screen'>
            <div className='w-full py-1 pb-3 flex items-center justify-end'>
              <h2 className='text-xl font-bold pb-2 mb-2 border-b border-gray-300'>
                {currentView.value === VIEW_NAME.INSPECT
                  ? t('form.inspect.title')
                  : t('form.report.title')}
              </h2>
            </div>
            <FormResponseSettingPage posFinishAction={handlePosFinishAction} />
          </div>
        )}
      </div>
    </Section>
  );
};
