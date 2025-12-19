import { useState, useEffect, useCallback } from 'preact/hooks';
import { IOption } from '@/components/common/multi/interface';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
// import { TextArea } from '@/components/common/text.area/text.area';
import { Switch } from '@/components/common/switch/switch';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { Form, Field } from 'react-final-form';
import { Signal, useSignal } from '@preact/signals';
import { lengthSize } from '@/utils/utilities';
import { ISendManualNotificationDto } from '@/types/notification/ISendManualNotificationDto';
import {
  NotificationService,
  PlaceService,
  TaskService,
  TemplateService,
} from '@/services';
import { ToastManager } from '@/utils/toast/toast-manager';
import { TaskFormCreate } from '@/pages/settings/shifts/task/create/task.form';
import { ITask } from '@/pages/settings/shifts/task/create/interface';
import { _onTaskAddWithId } from '@/pages/settings/shifts/task/create/utils';
import { useUserStore } from '@/store/slices';
import { showAlert } from '@/components/common/show-alert/show-alert';

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
  const [templateInformation, setTemplateInformation] = useState<any>();

  const templates = useSignal<IOption[]>([]);
  const tasks = useSignal<IOption[]>([]);
  const [tasksResponse, setTasksResponse] = useState<ITask[]>([]);
  const places: Signal<IOption[]> = useSignal([]);

  const [sendToShiftToday, setSendToShiftToday] = useState<boolean>(false);
  const [sendToGeneral, setSendToGeneral] = useState<boolean>(false);
  const [notificationType, setNotificationType] = useState<
    'GENERAL' | 'REPORT'
  >('GENERAL');
  // const [search, setSearch] = useState<string>('');
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [selectedUsersFull, setSelectedUsersFull] = useState<
    UserBasicInformation[]
  >([]);
  const usersWithPlayerId = externalUsers.filter((u) => !!u.playerId);
  const showInlineCreate = useSignal(false);
  // const filteredUsers = usersWithPlayerId.filter((u) => {
  //   const match = `${u.name} ${u.email}`
  //     .toLowerCase()
  //     .includes(search.toLowerCase());
  //   return sendToShiftToday ? match && !u.hasShiftToday : match;
  // });

  useEffect(() => {
    setSelectedUserIds(usersWithPlayerId?.map((u) => u.id));
  }, [externalUsers]);

  useEffect(() => {
    const finalUsers = usersWithPlayerId
      ?.filter((u) => selectedUserIds.includes(u.id))
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        playerId: u.playerId,
      }));

    setSelectedUsersFull(finalUsers);
  }, [selectedUserIds, usersWithPlayerId]);

  const getInitData = useCallback(async () => {
    const [request_task, request_template, request_places] = await Promise.all([
      TaskService.getSimplesList(),
      TemplateService.getBasicTemplates(),
      PlaceService.getSimpleList(),
    ]);

    if (request_task.getStatus()) {
      tasks.value = request_task.getMany();
    }

    if (request_template.getStatus()) {
      templates.value = request_template.getMany();
    }

    if (request_places.getStatus()) {
      places.value = request_places.getMany();
    }
  }, []);

  const handleSubmit = async (values: any) => {
    showAlert({
      title: t('d_send_notification'),
      message: t('l_send_notification_confirm'),
      onConfirm: () => {
        reallySend(values);
      },
      onCancel: () => {},
    });
  };

  const reallySend = async (values: any) => {
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
      tasks: tasksResponse,
      placeId: values.placeId?.value ? Number(values.placeId.value) : undefined,
      filters: {
        userIds: selectedUsersFull?.map((u) => String(u.id)),
        ...(sendToShiftToday && { shiftToday: true }),
      },
    };

    const result = await NotificationService.sendManualNotification(payload);

    if (!result.getStatus()) return;
    ToastManager.success('s_send_success');
    onClose?.();
  };

  const onTaskDelete = (id: string) => {
    setTasksResponse(tasksResponse.filter((task) => task.id !== id));
  };

  // const clearUserSelection = () => setSelectedUserIds([]);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    if (selectedCompany) {
      getInitData();
    }
  }, [selectedCompany]);

  const onTaskAdd = (model: any, t: number = 2) => {
    const size = tasksResponse.length + 1;
    const out = _onTaskAddWithId(model, size, t);
    setTasksResponse([...tasksResponse, ...(Array.isArray(out) ? out : [out])]);
    showInlineCreate.value = false;
  };

  const infoTemplate = async (value: IOption) => {
    setTemplateSelected(value);
    const responseTemplate = await TemplateService.getTemplateById(
      String(value.value)
    );
    if (!responseTemplate.getStatus()) return;
    const model = responseTemplate.getOne();
    const task = _onTaskAddWithId(model.tasks, 0, 2);
    setTemplateInformation(model);
    onTaskAdd(task);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      render={({ handleSubmit }) => (
        <form
          onSubmit={handleSubmit}
          className='space-y-6 w-full max-w-5xl mx-auto p-5 relative min-h-[50vh] flex flex-col justify-between pt-10'
        >
          <div className='flex flex-row w-full justify-between items-center absolute top-0 right-0 px-5'>
            <div className='flex items-center text-gray-700 dark:text-gray-200 bg-ternary py-2 px-2'>
              {t('t_user')}:{' '}
              <p className='mx-2 font-bold'>{selectedUserIds.length}</p>
            </div>
            <div className='flex items-center text-gray-700 dark:text-gray-200 bg-ternary py-2 px-2'>
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
                label='l_request_report'
                className='!font-bold'
              />
            </div>
          </div>
          <section>
            {/*
          <div className='space-y-2'>
            <input
              type='text'
              className='w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200'
              placeholder={t('p_searchPlaceholder')}
              value={search}
              onInput={(e) => setSearch(e.currentTarget.value)}
            />

            <div className='max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2'>
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
                    label='l_active_shift'
                  />
                )}
              </div>

              {selectedUserIds.length > 0 && (
                <Button
                  name='button-clear-user-selection'
                  label='l_clear_user'
                  mode='primary'
                  onClick={clearUserSelection}
                  borderless
                  unpadded
                  icon='053'
                />
              )}
            </div>

            {selectedUsersFull.length > 0 && (
              <div className='mt-2 border-y-b-light-dark dark:border-y-b-dark-light border-y py-3 max-h-40 overflow-y-auto vox-scroll-design'>
                <h5 className='font-medium mb-1'>{t('h_users_selected')}</h5>
                <ul className='list-disc list-inside space-y-1'>
                  {[
                    ...new Map(
                      selectedUsersFull?.map((u) => [u.id, u])
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
        */}

            <div className='grid grid-cols-2 gap-3 mb-3'>
              <Field<string>
                name='title'
                validate={lengthSize(5, 50)}
                render={({ input, meta }) => (
                  <Input
                    {...input}
                    label='l_custom_title'
                    meta={meta}
                    type='text'
                    icon='174'
                  />
                )}
              />
              <Field<string>
                name='description'
                validate={lengthSize(5, 200)}
                render={({ input, meta }) => (
                  <Input
                    {...input}
                    name='input-custom-description'
                    label='l_custom_description'
                    meta={meta}
                    type='text'
                    icon='174'
                  />
                )}
              />
              <div className='col-span-2'>
                {templateInformation && (
                  <div className='w-full bg-b-light-dark dark:bg-b-dark-light py-2 px-3 border-l-8 border-ternary mb-2 flex flex-row items-center '>
                    <p className='font-bold mr-2'>
                      {templateInformation.title}:
                    </p>
                    <p>{templateInformation.description}</p>
                  </div>
                )}
                <Field<IOption[]>
                  name='template'
                  render={({ input, meta }) => (
                    <SmartSelector
                      {...input}
                      meta={meta}
                      options={templates.value}
                      menuPortalTarget={document.body}
                      placeholder={'p_select_template'}
                      label={'l_template'}
                      icon='171'
                      onChange={(value?: IOption) => {
                        if (value) {
                          infoTemplate(value);
                        } else {
                          setTemplateSelected(undefined);
                          setTemplateInformation(undefined);
                        }
                      }}
                    />
                  )}
                />
              </div>
              {sendToGeneral && (
                <>
                  <div className='col-span-2'>
                    <TaskFormCreate
                      onSubmit={onTaskAdd}
                      onDelete={onTaskDelete}
                      add
                      selector
                      taskList={tasksResponse}
                      disabled={templateSelected ? true : false}
                      type={sendToGeneral ? 'REPORT' : 'GENERAL'}
                    />
                  </div>
                  <div className='col-span-2'>
                    <div className='w-full bg-b-light-dark dark:bg-b-dark-light py-2 px-3 border-l-8 border-amber-400 mb-2 flex flex-row items-center justify-between'>
                      <span className='vox-icon size-sm vx-icon-133 pr-3' />
                      <p>{t('d_notification_disclaimer')}</p>
                    </div>
                    <Field<IOption> name='placeId'>
                      {({ input, meta }) => (
                        <SmartSelector
                          {...input}
                          meta={meta}
                          placeholder='p_select_place'
                          label='l_place'
                          id='placeId'
                          icon='252'
                          options={places.value}
                        />
                      )}
                    </Field>
                  </div>
                </>
              )}
            </div>
          </section>

          <div className='flex justify-end'>
            <Button
              label='l_send_notification'
              mode='ternary'
              type='submit'
              name='button-notification'
              disabled={!hasplayers}
              icon='314'
            />
          </div>
        </form>
      )}
    />
  );
};
