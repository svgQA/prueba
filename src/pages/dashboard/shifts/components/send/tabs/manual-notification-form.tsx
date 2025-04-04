import { useState, useEffect } from 'preact/hooks';
import { NotificationServiceFront } from '@/services/notification';
import { ISendManualNotificationDto } from '@/types/notification/ISendManualNotificationDto';
import { FormService } from '@/services/form';
import { UserService } from '@/services/user';
import { TemplateServiceFront } from '@/services/template';

export const ManualNotificationForm = () => {
  const [templateId, setTemplateId] = useState('');
  const [templates, setTemplates] = useState([]);

  const [formId, setFormId] = useState('');
  const [formStructure, setFormStructure] = useState(null);

  const [overrideTitle, setOverrideTitle] = useState('');
  const [overrideDescription, setOverrideDescription] = useState('');
  const [sendToShiftToday, setSendToShiftToday] = useState(false);

  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [forms, setForms] = useState([]);

  useEffect(() => {
    UserService.getMinimalUsers()
      .then((res) => setUsers(res.data || []))
      .catch((err) => console.error('Error cargando usuarios:', err));

    FormService.getBasicForms()
      .then((res) => setForms(res.data || []))
      .catch((err) => console.error('Error cargando formularios:', err));

      TemplateServiceFront.getTemplates()
      .then((res) => {
        const templatesArray = Array.isArray(res?.data) ? res.data : res;
        setTemplates(templatesArray || []);
      })
      .catch((err) => console.error('Error cargando plantillas:', err));
    
  }, []);

  useEffect(() => {
    if (formId) {
      FormService.get_one(formId)
        .then((res) => setFormStructure(res.data?.structure || null))
        .catch(() => setFormStructure(null));
    } else {
      setFormStructure(null);
    }
  }, [formId]);

  const handleSubmit = async () => {
    const safeUserIds = selectedUserIds.map(String);

    const payload: ISendManualNotificationDto = {
      ...(templateId && { templateId }),
      ...(formId && { formId }),
      ...(overrideTitle && { overrideTitle }),
      ...(overrideDescription && { overrideDescription }),
      filters: {
        ...(safeUserIds.length > 0 && { userIds: safeUserIds }),
        ...(sendToShiftToday && { shiftToday: true }),
      },
      ...(formStructure && { data: { formId, formStructure } }),
    };

    try {
      await NotificationServiceFront.sendManualNotification(payload);
      alert("Notificación enviada con éxito");
    } catch (err) {
      console.error("Error al enviar notificación:", err);
      alert("Error al enviar notificación");
    }
  };

  const clearUserSelection = () => setSelectedUserIds([]);

  return (
    <div className='space-y-6 w-full max-w-5xl mx-auto'>
      <h4 className='text-xl font-semibold text-gray-800'>Enviar notificación manual</h4>

      {/* Filtro de usuarios */}
      <div className='space-y-2'>
        <label className='block text-sm font-medium mb-1'>Usuarios</label>
        <input
          type='text'
          className='w-full border border-gray-300 rounded px-3 py-2'
          placeholder='Buscar por nombre o email...'
          value={search}
          onInput={(e) => setSearch(e.currentTarget.value)}
        />
        <div className='max-h-48 overflow-y-auto border border-gray-200 rounded p-2 bg-white'>
          {users
            .filter((u: any) => {
              const match = `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase());
              return sendToShiftToday ? match && u.hasShiftToday : match;
            })
            .map((user: any) => (
              <label key={user.id} className='flex items-center gap-2 py-1'>
                <input
                  type='checkbox'
                  value={user.id}
                  checked={selectedUserIds.includes(user.id)}
                  onChange={() =>
                    setSelectedUserIds((prev) =>
                      prev.includes(user.id)
                        ? prev.filter((id) => id !== user.id)
                        : [...prev, user.id]
                    )
                  }
                  className='accent-cyan-600'
                />
                <span className='text-sm'>{user.name} ({user.email})</span>
              </label>
            ))}
        </div>

        <div className='flex items-center gap-2 mt-2'>
          <input
            type='checkbox'
            checked={sendToShiftToday}
            onChange={(e) => setSendToShiftToday(e.currentTarget.checked)}
            className='accent-cyan-600'
          />
          <span className='text-sm'>Solo con turno activo</span>
        </div>

        {selectedUserIds.length > 0 && (
          <button
            className='text-sm text-cyan-700 hover:underline mt-1'
            onClick={clearUserSelection}
          >
            Limpiar selección de usuarios
          </button>
        )}

        <p className='text-xs text-gray-500 italic'>
          Si no seleccionas usuarios, se enviará a todos los que cumplan el filtro.
        </p>
      </div>

      {/* Plantilla y formulario */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-medium mb-1'>Plantilla</label>
          <select
            className='w-full border border-gray-300 rounded px-3 py-2'
            value={templateId}
            onChange={(e) => {
              setTemplateId(e.currentTarget.value);
              setFormId('');
              setFormStructure(null);
            }}
          >
            <option value=''>Selecciona una plantilla</option>
            {templates.map((tpl: any) => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Formulario</label>
          <select
            className='w-full border border-gray-300 rounded px-3 py-2'
            value={formId}
            onChange={(e) => {
              setFormId(e.currentTarget.value);
              setTemplateId('');
            }}
          >
            <option value=''>Selecciona un formulario</option>
            {forms.map((form: any) => (
              <option key={form.id} value={form.id}>
                {form.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Campos personalizados (solo si no hay plantilla seleccionada) */}
      {!templateId && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium mb-1'>Título personalizado</label>
            <input
              className='w-full border border-gray-300 rounded px-3 py-2'
              value={overrideTitle}
              onInput={(e) => setOverrideTitle(e.currentTarget.value)}
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Descripción personalizada</label>
            <textarea
              className='w-full border border-gray-300 rounded px-3 py-2'
              rows={3}
              value={overrideDescription}
              onInput={(e) => setOverrideDescription(e.currentTarget.value)}
            />
          </div>
        </div>
      )}

      {/* Botón de envío */}
      <div className='pt-4'>
        <button
          className='bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded'
          onClick={handleSubmit}
        >
          Enviar notificación
        </button>
      </div>
    </div>
  );
};
