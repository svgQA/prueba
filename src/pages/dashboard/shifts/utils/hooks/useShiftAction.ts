/* Acciones de tabla: update/delete/check-in/out/download. */
import { useCallback } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
// import { Signal } from '@preact/signals';
// import { IShiftResponse } from '@/types/shift/activity';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ToastManager } from '@/utils/toast/toast-manager';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { SHIFT_STATUS } from '@/types/shift/shift.enum.ts';
import { getLocation } from '@/utils/utilities/location';
import { ShiftService } from '@/services';
import {
  openSpinner,
  closeSpinner,
} from '@/store/signals/modals/spinner.signal';
import { ReportService } from '@/services/report/report';
import { fileManager } from '@/utils/network/file/file';
import { IShiftReportRequest } from '@/types/report/report.request';
import { ReportType } from '@/types/report/report.enum';
import {
  Task,
  TaskStatus,
  TaskType,
} from '@/components/compose/gantt/types/public-types';
import { signalShifts } from '@/store/signals/shift';

export function useShiftActions(params: {
  // shifts: Signal<IShiftResponse[]>;
  openUpsert: () => void;
  setTaskSelected: (t?: Task) => void;
  setKeywordsSelected: (k: string[]) => void;
  setTimeBeforeSelected: (n: number) => void;
  setExternalSelected: (s: string) => void;
  refetch: () => void;
}) {
  const { t } = useTranslation();
  const {
    // shifts,
    openUpsert,
    setTaskSelected,
    setKeywordsSelected,
    setTimeBeforeSelected,
    setExternalSelected,
    refetch,
  } = params;

  const deleteShift = useCallback(
    async (id: string) => {
      const response = await ShiftService.deleteActivity(id);
      if (!response.getStatus()) return;
      ToastManager.success('s_deleted_success');
      refetch();
    },
    [refetch]
  );

  const handleDownloadShift = useCallback(
    async (shiftId: number) => {
      openSpinner();

      const shift = signalShifts.value.find((s) => s.id === shiftId);

      const data: IShiftReportRequest = {
        shiftId,
        type: ReportType.Shift,
        shift,
      };

      const response = await ReportService.download_one_module_pdf(data);

      if (!response.getStatus()) {
        closeSpinner();
        ToastManager.error('s_download_file_error');
        return;
      }

      fileManager.downloadBase64File(
        response.getOne(),
        'application/pdf',
        'response.pdf'
      );

      closeSpinner();
    },
    [signalShifts]
  );

  const handleCheck = useCallback(async (type: string, shiftId: number) => {
    const position = await getLocation();
    if (!position) {
      ToastManager.error('s_gps_error');
      return;
    }

    const checkData = {
      latitude: position.coords.latitude.toString(),
      longitude: position.coords.longitude.toString(),
      date: new Date().toISOString(),
      platform: 'web',
      type,
    };

    const response = await ShiftService.createCheck(checkData, shiftId);
    if (response.getStatus()) {
      ToastManager.success('s_created_success');
    }
  }, []);

  const checkItem = useCallback(
    (check: any, row: any) => {
      const updatedRow = { ...row };
      if (check.type === 'CHECK_IN') updatedRow.checkIn = check;
      else updatedRow.checkOut = check;

      signalShifts.value = signalShifts.value.map((s) =>
        s.id === row.id ? updatedRow : s
      );
    },
    [signalShifts]
  );

  const onClickAction = useCallback(
    (paramsAction: { id: string; type: string; action: ROW_ACTIONS }) => {
      switch (paramsAction.action) {
        case ROW_ACTIONS.UPDATE: {
          const shiftUpdate = signalShifts.value.find(
            (s) => s.id === Number(paramsAction.id)
          );

          setTaskSelected({
            id: Number(paramsAction.id),
            end: shiftUpdate?.end || '',
            start: shiftUpdate?.start || '',
            type: shiftUpdate?.type as TaskType,
            userId: String(shiftUpdate?.employee?.id || ''),
            serviceId: shiftUpdate?.serviceId || '',
            phone: shiftUpdate?.service?.contract.client.phone || '',
            contract: String(shiftUpdate?.service?.contract.id || ''),
            client: String(shiftUpdate?.service?.contract.client.id || ''),
            cardId: shiftUpdate?.employee?.cardId || '',
            status: shiftUpdate?.status as TaskStatus,
            name: shiftUpdate?.service?.name || '',
            progress: 0,
            service: shiftUpdate?.service?.name || '',
            client_name: String(shiftUpdate?.service?.contract.client.id || ''),
          });

          setKeywordsSelected(shiftUpdate?.keywords || []);
          setTimeBeforeSelected(shiftUpdate?.timeBefore || 0);
          setExternalSelected(shiftUpdate?.externalId || '');
          openUpsert();
          break;
        }

        case ROW_ACTIONS.DELETE: {
          const shift = signalShifts.value.find(
            (s) => s.id === Number(paramsAction.id)
          );

          if (!shift) {
            ToastManager.error('s_deleted_error');
            return;
          }

          const status = shift.status as unknown as SHIFT_STATUS;
          if (status !== SHIFT_STATUS.CREATED) {
            ToastManager.warning('s_warning');
            return;
          }

          showAlert({
            title: t('s_title_delete'),
            message: t('s_message'),
            onConfirm: () => deleteShift(paramsAction.id),
            onCancel: () => {},
          });
          break;
        }

        case ROW_ACTIONS.CHECK_IN: {
          showAlert({
            title: t('h_check_in'),
            message: t('s_request'),
            onConfirm: () => handleCheck('CHECK_IN', Number(paramsAction.id)),
            onCancel: () => {},
          });
          break;
        }

        case ROW_ACTIONS.CHECK_OUT: {
          showAlert({
            title: t('h_check_out'),
            message: t('s_request'),
            onConfirm: () => handleCheck('CHECK_OUT', Number(paramsAction.id)),
            onCancel: () => {},
          });
          break;
        }

        case ROW_ACTIONS.DOWNLOAD: {
          handleDownloadShift(Number(paramsAction.id));
          break;
        }
      }
    },
    [
      deleteShift,
      handleCheck,
      handleDownloadShift,
      openUpsert,
      setExternalSelected,
      setKeywordsSelected,
      setTaskSelected,
      setTimeBeforeSelected,
      t,
    ]
  );

  const handleTaskDelete = useCallback(
    (task: any) => {
      window.confirm(t('shifts.confirmDelete', { name: task.name }));
    },
    [t]
  );

  return { onClickAction, checkItem, handleTaskDelete };
}
