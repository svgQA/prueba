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

const normalizeUserIds = (ids: any[]): number[] => {
  return [
    ...new Set(
      (ids || []).map((x) => Number(x)).filter((n) => Number.isFinite(n))
    ),
  ];
};

interface Props {
  users?: any[];
  hasplayers?: boolean;
  onClose?: () => void;
  unreport?: boolean;
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
  unreport = false,
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

  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [selectedUsersFull, setSelectedUsersFull] = useState<
    UserBasicInformation[]
  >([]);
  const usersWithPlayerId = externalUsers.filter((u) => !!u.playerId);
  const showInlineCreate = useSignal(false);

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

    if (request_task.getStatus()) tasks.value = request_task.getMany();
    if (request_template.getStatus())
      templates.value = request_template.getMany();
    if (request_places.getStatus()) places.value = request_places.getMany();
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

    const normalizedUserIds = normalizeUserIds(
      selectedUsersFull?.map((u) => u.id) ?? selectedUserIds
    );

    setSelectedUserIds(normalizedUserIds);

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
        userIds: normalizedUserIds.map(String),
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

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    if (selectedCompany) getInitData();
  }, [selectedCompany]);

  const onTaskAdd = (model: any, t: number = 2) => {
    const size = tasksResponse.length + 1;
    const out = _onTaskAddWithId(model, size, t);
    setTasksResponse([...tasksResponse, ...(Array.isArray(out) ? out : [out])]);
    showInlineCreate.value = false;
  };

  /**
   * IMPORTANTE:
   * - además de setTemplateSelected, aquí seteamos title y description en el form
   *   cuando el usuario elige template (punto 4).
   */
  const infoTemplate = async (value: IOption, form?: any) => {
    setTemplateSelected(value);

    const responseTemplate = await TemplateService.getTemplateById(
      String(value.value)
    );
    if (!responseTemplate.getStatus()) return;

    const model = responseTemplate.getOne();
    setTemplateInformation(model);

    // Punto 4: setear title/description con lo del template para que queden llenos
    if (form) {
      if (model?.title) form.change('title', model.title);
      if (model?.description) form.change('description', model.description);
    }

    // Tu lógica actual de tasks
    const task = _onTaskAddWithId(model.tasks, 0, 2);
    onTaskAdd(task);
  };

  /**
   * Validadores condicionales:
   * - Si hay template seleccionado => no validar (undefined)
   * - Si no hay template => validar length
   */
  const validateTitle = (value: string) => {
    if (templateSelected?.value) return undefined;
    return lengthSize(5, 50)(value);
  };

  const validateDescription = (value: string) => {
    if (templateSelected?.value) return undefined;
    return lengthSize(5, 200)(value);
  };

  const renderOneSignalPreview = (values: any) => {
    const title =
      values?.title || templateInformation?.title || t('l_custom_title');

    const description =
      values?.description ||
      templateInformation?.description ||
      t('l_custom_description');

    const placeLabel = values?.placeId?.label;

    return (
      <div className='col-span-2'>
        <div className='w-full bg-b-light-dark dark:bg-b-dark-light py-3 px-3 border-l-8 border-sky-400 mb-2'>
          <p className='font-bold mb-2 flex items-center'>
            <span className='vox-icon size-sm vx-icon-314 pr-2' />
            {t('l_preview')} (OneSignal)
          </p>

          {/* “Card” estilo push */}
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3'>
            <div className='flex items-start gap-3'>
              <div className='w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold'>
                App
              </div>
              <div className='flex-1'>
                <p className='font-semibold text-gray-900 dark:text-gray-100'>
                  {title}
                </p>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  {description}
                </p>

                {sendToGeneral && placeLabel && (
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
                    {t('l_place')}: {placeLabel}
                  </p>
                )}
              </div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>
                now
              </div>
            </div>
          </div>

          <p className='text-xs text-gray-600 dark:text-gray-300 mt-2'>
            {t('d_preview_disclaimer')}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Form
      onSubmit={handleSubmit}
      render={({ handleSubmit, form, values }) => (
        <form
          onSubmit={handleSubmit}
          className='space-y-6 w-full max-w-5xl mx-auto p-5 relative min-h-[50vh] flex flex-col justify-between pt-10'
        >
          <div className='flex flex-row w-full justify-between items-center absolute top-0 right-0 px-5'>
            <div className='flex items-center text-white bg-ternary py-2 px-2'>
              {t('t_user')}:{' '}
              <p className='mx-2 font-bold'>{selectedUserIds.length}</p>
            </div>
            {unreport}
            {!unreport && (
              <div className='flex items-center bg-ternary py-2 px-2'>
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
                  className='!font-bold text-white'
                />
              </div>
            )}
          </div>

          <section>
            {renderOneSignalPreview(values)}
            <div className='grid grid-cols-2 gap-3 mb-3'>
              <Field<string>
                name='title'
                validate={validateTitle}
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
                validate={validateDescription}
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
                <div className='w-full bg-b-light-dark dark:bg-b-dark-light py-2 px-3 border-l-8 border-amber-400 mb-2 flex flex-row items-center justify-between'>
                  <span className='vox-icon size-sm vx-icon-133 pr-3' />
                  <p>{t('d_template_disclaimer')}</p>
                </div>

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
                          // trae template + setea title/description (punto 4)
                          infoTemplate(value, form);
                        } else {
                          setTemplateSelected(undefined);
                          setTemplateInformation(undefined);

                          // (Opcional) Si quieres limpiar los campos al quitar template:
                          // form.change('title', '');
                          // form.change('description', '');

                          // también podrías limpiar tasksResponse si aplica
                        }
                      }}
                    />
                  )}
                />
              </div>

              {/* Punto 3: Preview OneSignal */}

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
