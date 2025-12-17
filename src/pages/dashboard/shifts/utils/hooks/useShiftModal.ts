/* Manejo de modales y el flujo especial del botón de notificaciones. */
import { useCallback, useState } from 'preact/hooks';
import { Signal } from '@preact/signals';
import { ToastManager } from '@/utils/toast/toast-manager';
import { VIEW_NAME } from '../view.name';
import { useSyncedRef } from '@/utils/hooks/useSyncedRef';

export function useShiftModals(params: {
  currentView: Signal<VIEW_NAME>;
  showUpsertModal: Signal<boolean>;
  showSendModal: Signal<boolean>;
  showShiftModal: Signal<boolean>;
  hasValidPlayer: boolean;
  selectedUsers: any[];
}) {
  const {
    currentView,
    showUpsertModal,
    showSendModal,
    showShiftModal,
    hasValidPlayer,
    selectedUsers,
  } = params;

  const [onNotifications, setOnNotifications] = useState(false);

  const hasValidPlayerRef = useSyncedRef(hasValidPlayer);
  const onNotificationsRef = useSyncedRef(onNotifications);

  const handleViewChange = useCallback(
    (view: VIEW_NAME) => {
      currentView.value = view;
    },
    [currentView]
  );

  const toggleUpsertModal = useCallback(() => {
    showUpsertModal.value = !showUpsertModal.value;
  }, [showUpsertModal]);

  const toggleShiftModal = useCallback(() => {
    showShiftModal.value = !showShiftModal.value;
  }, [showShiftModal]);

  const handleCloseSendModal = useCallback(() => {
    showSendModal.value = false;
    setOnNotifications(false);
  }, [showSendModal]);

  const toggleSendModal = useCallback(() => {
    handleViewChange(VIEW_NAME.TABLE);

    if (!hasValidPlayerRef.current) {
      ToastManager.warning('s_there_are_not_player_id');
      return;
    }

    if (!onNotificationsRef.current) {
      setOnNotifications(true);
      return;
    }

    if (selectedUsers.length === 0) {
      ToastManager.warning('s_must_some_selected');
      setOnNotifications(false);
      return;
    }

    showSendModal.value = true;
  }, [
    handleViewChange,
    hasValidPlayerRef,
    onNotificationsRef,
    selectedUsers,
    showSendModal,
  ]);

  return {
    onNotifications,
    setOnNotifications,
    handleViewChange,
    toggleSendModal,
    toggleUpsertModal,
    toggleShiftModal,
    handleCloseSendModal,
  };
}
