import { useState, useEffect, useCallback } from 'preact/hooks';
import { IOption } from '@/components/common/multi/interface';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { Switch } from '@/components/common/switch/switch';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { Form, Field } from 'react-final-form';
import { useSignal } from '@preact/signals';
import { lengthSize } from '@/utils/utilities';
import { ISendManualNotificationDto } from '@/types/notification/ISendManualNotificationDto';
import { NotificationService, TaskService, TemplateService } from '@/services';
import { ToastManager } from '@/utils/toast/toast-manager';
import { TaskFormCreate } from '@/pages/settings/shifts/task/create/task.form';
import { ITask } from '@/pages/settings/shifts/task/create/interface';
import { _onTaskAddWithId } from '@/pages/settings/shifts/task/create/utils';

interface Props {
  users?: any[];
  hasplayers?: boolean;
  onClose?: () => void;
}

interface UserBasicInformation {
  id: number;
  name: string;
  email: string;
  playerId: string;
}

export const ManualNotificationForm = ({
  users: externalUsers = [],
  hasplayers,
  onClose,
}: Props) => {
  const { t } = useTranslation();
  const [templateSelected, setTemplateSelected] = useState<
    IOption | undefined
  >();

  const templates = useSignal<IOption[]>([]);
  const tasks = useSignal<IOption[]>([]);
  const tasksResponse = useSignal<ITask[]>([]);

  const [sendToShiftToday, setSendToShiftToday] = useState<boolean>(false);
  const [sendToGeneral, setSendToGeneral] = useState<boolean>(false);
  const [notificationType, setNotificationType] = useState<
    'GENERAL' | 'REPORT'
  >('GENERAL');
  const [search, setSearch] = useState<string>('');
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [selectedUsersFull, setSelectedUsersFull] = useState<
    UserBasicInformation[]
  >([]);
  const usersWithPlayerId = externalUsers.filter((u) => !!u.playerId);
  const showInlineCreate = useSignal(false);
  const filteredUsers = usersWithPlayerId.filter((u) => {
    const match = `${u.name} ${u.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return sendToShiftToday ? match && !u.hasShiftToday : match;
  });

  useEffect(() => {
    setSelectedUserIds(usersWithPlayerId.map((u) => u.id));
  }, [externalUsers]);

  useEffect(() => {
    const finalUsers = usersWithPlayerId
      .filter((u) => selectedUserIds.includes(u.id))
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        playerId: u.playerId,
      }));

    setSelectedUsersFull(finalUsers);
  }, [selectedUserIds, usersWithPlayerId]);

  const getInitData = useCallback(async () => {
    const [request_task, request_template] = await Promise.all([
      TaskService.getSimplesList(),
      TemplateService.getBasicTemplates(),
    ]);

    if (request_task.getStatus()) {
      tasks.value = request_task.getMany();
    }

    if (request_template.getStatus()) {
      templates.value = request_template.getMany();
    }
  }, []);

  const handleSubmit = async (values: any) => {
    if (!hasplayers) return;
    /*
     * const result = await NotificationService.sendManualNotification(output);
     * if (!result.getStatus()) return;
     * ToastManager.success('s_send_success');
     * onClose?.();
     */

    /* DELETE: Posibllemente eliminar esto */
    const payload: ISendManualNotificationDto = {
      notificationType: notificationType.toLowerCase(),
      ...(values.template?.value && { templateId: values.template.value }),
      ...(!values.template?.value &&
        values.task?.value && { taskId: Number(values.task.value) }),
      overrideTitle: values.title,
      overrideDescription: values.description,
      tasks: tasksResponse.value,
      filters: {
        userIds: selectedUsersFull.map((u) => String(u.id)),
        ...(sendToShiftToday && { shiftToday: true }),
      },
    };

    // console.log(payload);
    const result = await NotificationService.sendManualNotification(payload);

    if (!result.getStatus()) return;
    ToastManager.success('s_send_success');
    onClose?.();
    /* DELETE: Posibllemente eliminar esto */
  };

  const clearUserSelection = () => setSelectedUserIds([]);

  useEffect(() => {
    getInitData();
  }, []);

  const onTaskAdd = (model: any) => {
    if (Array.isArray(model)) {
      tasksResponse.value = [...tasksResponse.value, ...model];
    } else {
      tasksResponse.value = [...tasksResponse.value, model];
    }
    showInlineCreate.value = false;
  };

  const infoTemplate = async (value: IOption) => {
    setTemplateSelected(value);
    // console.log(value);
    const responseTemplate = await TemplateService.getTemplateById(
      String(value.value)
    );
    if (!responseTemplate.getStatus()) return;
    const model = responseTemplate.getOne();
    const task = _onTaskAddWithId(model.tasks, 0, 2);
    onTaskAdd(task);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      render={({ handleSubmit }) => (
        <form
          onSubmit={handleSubmit}
          className='space-y-6 w-full max-w-5xl mx-auto p-1'
        >
          <div className='flex items-center text-gray-700 dark:text-gray-200'>
            <Switch
              name='switch-send-to-general'
              backgroundColor='bg-gray-300 dark:bg-gray-600'
              value={sendToGeneral}
              onChange={(e) => {
                const checked = e.currentTarget.checked;
                setSendToGeneral(checked);
                setSendToShiftToday(checked);
                setNotificationType(checked ? 'REPORT' : 'GENERAL');
              }}
              label='¿Esta es una solicitud de reporte a la central?'
            />
          </div>

          <div className='space-y-2'>
            <input
              type='text'
              className='w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200'
              placeholder={t('shifts.notifications.searchPlaceholder')}
              value={search}
              onInput={(e) => setSearch(e.currentTarget.value)}
            />

            <div className='max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2  bg-white dark:bg-b-dark-dark'>
              {[...new Map(filteredUsers.map((u) => [u.id, u])).values()].map(
                (user: any) => (
                  <label
                    key={user.id}
                    className='flex items-center gap-2 py-1 text-gray-700 dark:text-gray-200'
                  >
                    <Switch
                      backgroundColor='bg-gray-300 dark:bg-gray-600'
                      name={`switch-${user.id}`}
                      identifier={user.id}
                      value={selectedUserIds.includes(user.id)}
                      onChange={() =>
                        setSelectedUserIds((prev) =>
                          prev.includes(user.id)
                            ? prev.filter((id) => id !== user.id)
                            : [...new Set([...prev, user.id])]
                        )
                      }
                    />
                    <span className='text-sm'>
                      {user.name} ({user.email})
                    </span>
                  </label>
                )
              )}
            </div>

            <div className='flex items-center justify-between mt-2'>
              <div className='flex items-center gap-2 text-gray-700 dark:text-gray-200'>
                {sendToGeneral && (
                  <Switch
                    name='switch-send-to-shift-today'
                    backgroundColor='bg-gray-300 dark:bg-gray-600'
                    value={sendToShiftToday}
                    onChange={(e) =>
                      setSendToShiftToday(e.currentTarget.checked)
                    }
                    label='Solo con turno activo'
                  />
                )}
              </div>

              {selectedUserIds.length > 0 && (
                <Button
                  name='button-clear-user-selection'
                  label='Limpiar selección de usuarios'
                  mode='primary'
                  onClick={clearUserSelection}
                  borderless
                  unpadded
                  icon='053'
                />
              )}
            </div>

            {selectedUsersFull.length > 0 && (
              <div className='mt-2 border-y-b-light-dark dark:border-y-b-dark-light border-y py-3'>
                <h5 className='font-medium mb-1'>
                  Usuarios seleccionados con registro de notificaciones:
                </h5>
                <ul className='list-disc list-inside space-y-1'>
                  {[
                    ...new Map(
                      selectedUsersFull.map((u) => [u.id, u])
                    ).values(),
                  ].map((u) => (
                    <li key={u.id}>
                      {u.name} ({u.email})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className='w-full'>
            <Field<IOption[]>
              name='template'
              render={({ input, meta }) => (
                <SmartSelector
                  {...input}
                  meta={meta}
                  options={templates.value}
                  menuPortalTarget={document.body}
                  placeholder='Selecciona una plantilla'
                  label='Plantilla'
                  onChange={(value?: IOption) => {
                    if (value) infoTemplate(value);
                  }}
                />
              )}
            />
          </div>

          <TaskFormCreate
            onSubmit={onTaskAdd}
            add
            selector
            taskList={tasksResponse.value}
            disabled={templateSelected ? true : false}
            type={sendToGeneral ? 'REPORT' : 'GENERAL'}
          />

          <div className='flex flex-col gap-2'>
            <Field<string>
              name='title'
              validate={lengthSize(5, 50)}
              render={({ input, meta }) => (
                <Input
                  {...input}
                  label={t('shifts.notifications.customTitle')}
                  meta={meta}
                  type='text'
                />
              )}
            />
            <Field<string>
              name='description'
              validate={lengthSize(5, 200)}
              render={({ input, meta }) => (
                <TextArea
                  {...input}
                  name='input-custom-description'
                  label={t('shifts.notifications.customDescription')}
                  meta={meta}
                  type='text'
                />
              )}
            />
          </div>

          <div className='flex justify-end'>
            <Button
              label='Enviar notificacion'
              mode='ternary'
              type='submit'
              name='button-notification'
              disabled={!hasplayers}
              icon='039'
            />
          </div>
        </form>
      )}
    />
  );
};
