import { FormService, IResponseSummary } from '@/services';
import { IResponseResponse, modulesReport } from '@/types/form';
import { useSignal } from '@preact/signals';
import { type FunctionComponent } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
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
import { handleNotificationEvent } from '@/components/common/notifications/components/notification.event';

/**
 * TODO: WebSocket
 */
import { WebSocketManager } from '@/utils/socket/manager/manager';
import {
  InSocketMessage,
  SOCKET_MESSAGE_AREA,
  SOCKET_MESSAGE_EVENTS,
  MessageEvent,
  MESSAGE_LISTENERS,
} from '@/utils/socket/manager/types';
import { ButtonsPage, CardsPage, SectionPage } from '@/pages/component';

export const FormsPage: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const responses = useSignal<IResponseResponse[]>([]);
  const loading = useSignal<boolean>(false);
  const { selectedCompany } = useUserStore();
  const summary = useSignal<IResponseSummary>(defaultSummary);
  const [highlightedId, setHighlightedId] = useState<string>();

  useEffect(() => {
    document.title = t('p_form');
  }, []);

  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      getResponseHandler();
      selectedNotifier();
    }
  }, [selectedCompany, location]);

  useEffect(() => {
    WebSocketManager.add(
      SOCKET_MESSAGE_AREA.FORM,
      handleMessage,
      MESSAGE_LISTENERS.FORM
    );
    return () => {
      WebSocketManager.remove(SOCKET_MESSAGE_AREA.FORM, MESSAGE_LISTENERS.FORM);
    };
  }, []);

  const handleMessage = (event: InSocketMessage<MessageEvent>) => {
    const { type: name, message } = event.payload;

    if (name === SOCKET_MESSAGE_EVENTS.UPDATE_CHECK) {
      const memoIndex = responses.value.findIndex(
        (data) => data.id === message.id
      );
      if (memoIndex < 0) return;
      const copyResponses: IResponseResponse[] = responses.value;
      copyResponses[memoIndex].status = message.status;
      copyResponses[memoIndex].updatedAt = message.updatedAt;
      responses.value = [...copyResponses];
    }

    if (name === SOCKET_MESSAGE_EVENTS.CREATE) {
      getResponseHandler();
    }
  };

  const selectedNotifier = () => {
    handleNotificationEvent('go-to-panic-table', (id: any) =>
      setHighlightedId(String(id))
    );
  };

  const getResponseHandler = async () => {
    loading.value = true;
    const [responseForm, responseSummary] = await Promise.all([
      FormService.get_response_all(),
      FormService.get_response_summary(),
    ]);

    if (responseForm.getStatus()) {
      responses.value = responseForm.getMany();
    }

    if (responseSummary.getStatus()) {
      summary.value = responseSummary.getOne();
    }

    loading.value = false;
  };

  const handleOnClick = async (action: IRowAction) => {
    const data = await FormService.get_structure(String(action.id));
    if (!data.getStatus()) {
      ToastManager.error('s_not_exist');
      return;
    }

    const response = data.getOne();
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
        const deleteResponse = await FormService.remove_response_one(
          response.id
        );
        if (!deleteResponse.getStatus()) return;
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
    <SectionPage
      padding
      cards={
        <CardsPage>
          <CardData
            title='h_forms_total'
            count={summary.value.total}
            subtitle='h_forms_subtitle'
            color='t-dark'
            icon='0001'
          />

          <CardData
            title='h_forms_active'
            count={calculatePercentage(summary.value)}
            subtitle='h_forms_active_subtitle'
            color='t-dark'
            icon='311'
          />

          <CardData
            title='h_forms_archived'
            count={calculatePercentage(summary.value, true)}
            subtitle='h_forms_archived_subtitle'
            color='t-dark'
            icon='000'
          />
        </CardsPage>
      }
      buttons={
        <ButtonsPage>
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
            disabled
            selected={currentView.value === VIEW_NAME.INSPECT}
            icon='418'
          />
        </ButtonsPage>
      }
    >
      {currentView.value === VIEW_NAME.TABLE && (
        <Table<IResponseResponse>
          key={i18n.language}
          data={responses.value}
          columns={getColumns(handleOnClick)}
          onClickAction={handleOnClick}
          loading={loading.value}
          rowClassName={(row: IResponseResponse) =>
            highlightedId === String(row.id) ? 'animate-highlight' : ''
          }
          visibility={{
            contract: false,
            service: false,
            client: false,
          }}
          modules={modulesReport.Form}
          range={true}
        />
      )}
      {(currentView.value === VIEW_NAME.INSPECT ||
        currentView.value === VIEW_NAME.REPORT) && (
        <div className='max-h-screen'>
          <div className='w-full py-1 pb-3 flex items-center justify-end'>
            <h2 className='text-xl font-bold pb-2 mb-2 border-b border-gray-300'>
              {currentView.value === VIEW_NAME.INSPECT
                ? t('s_inspect_title')
                : t('s_title')}
            </h2>
          </div>
          <FormResponseSettingPage
            posFinishAction={handlePosFinishAction}
            type={currentView.value === VIEW_NAME.INSPECT ? 'INSPECT' : 'VIEW'}
          />
        </div>
      )}
    </SectionPage>
  );
};
