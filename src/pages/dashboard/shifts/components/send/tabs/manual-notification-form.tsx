import { useState, useEffect } from 'preact/hooks';
import { FormService } from '@/services/form/form';
import { TemplateService } from '@/services/notification/template';
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
import { NotificationService } from '@/services';
import { ToastManager } from '@/utils/toast/toast-manager';

interface Props {
  users?: any[];
  hasplayers?: boolean;
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
}: Props) => {
  const { t } = useTranslation();
  const [templateSelected, setTemplateSelected] = useState<
    IOption | undefined
  >();
  const [formSelected, setFormSelected] = useState<IOption | undefined>();
  const [formStructure, setFormStructure] = useState<any>(null);

  const templates = useSignal<IOption[]>([]);
  const forms = useSignal<IOption[]>([]);

  const [sendToShiftToday, setSendToShiftToday] = useState<boolean>(false);

  const [search, setSearch] = useState<string>('');
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [selectedUsersFull, setSelectedUsersFull] = useState<
    UserBasicInformation[]
  >([]);
  const usersWithPlayerId = externalUsers.filter((u) => !!u.playerId);

  const filteredUsers = usersWithPlayerId.filter((u) => {
    const match = `${u.name} ${u.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return sendToShiftToday ? match && u.hasShiftToday : match;
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

  const handleSubmit = async (values: any) => {
    if (!hasplayers) return;

    const payload: ISendManualNotificationDto = {
      templateId: values.template?.value,
      formId: values.form?.value,
      ...(!templateSelected && {
        overrideTitle: values.title,
        overrideDescription: values.description,
      }),
      filters: {
        userIds: selectedUsersFull.map((u) => String(u.id)),
        ...(sendToShiftToday && { shiftToday: true }),
      },
      ...(formStructure && {
        data: { formId: values.form?.value, formStructure },
      }),
    };
    const response = await NotificationService.sendManualNotification(payload);
    if (response.getStatus()) ToastManager.success('notification.send.success');
  };

  const clearUserSelection = () => setSelectedUserIds([]);

  useEffect(() => {
    const fetchFormsAndTemplates = async () => {
      try {
        const [formsResponse, templatesResponse] = await Promise.all([
          FormService.getBasicForms(),
          TemplateService.getBasicTemplates(),
        ]);

        if (formsResponse.getStatus()) forms.value = formsResponse.getMany();
        if (templatesResponse.getStatus())
          templates.value = templatesResponse.getMany();
      } catch (err) {
        ToastManager.error('notification.send.error_loading_forms_templates');
      }
    };
    fetchFormsAndTemplates();
  }, []);

  useEffect(() => {
    const getFormStructure = async () => {
      if (!formSelected) return;
      const response = await FormService.get_one(Number(formSelected.value));
      if (response.getStatus()) setFormStructure(response.getOne());
    };
    getFormStructure();
  }, [formSelected]);

  return (
    <Form
      onSubmit={handleSubmit}
      render={({ handleSubmit }) => (
        <form
          onSubmit={handleSubmit}
          className='space-y-6 w-full max-w-5xl mx-auto p-1'
        >
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
                <Switch
                  name='switch-send-to-shift-today'
                  backgroundColor='bg-gray-300 dark:bg-gray-600'
                  value={sendToShiftToday}
                  onChange={(e) => setSendToShiftToday(e.currentTarget.checked)}
                  label='Solo con turno activo'
                />
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

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
                    setTemplateSelected(value);
                  }}
                />
              )}
            />

            <Field<IOption[]>
              name='form'
              render={({ input, meta }) => (
                <SmartSelector
                  {...input}
                  meta={meta}
                  options={forms.value}
                  menuPortalTarget={document.body}
                  placeholder='Selecciona un formulario'
                  label='Formulario'
                  onChange={(value?: IOption) => {
                    setFormSelected(value);
                  }}
                />
              )}
            />
          </div>

          {!templateSelected && (
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
          )}
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
