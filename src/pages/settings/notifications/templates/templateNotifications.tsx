import { useEffect, useState } from 'preact/hooks';
import { Section } from '@/components/common/section/section';
import { Button } from '@/components/common/button/button';
import { TemplateServiceFront } from '@/services/template';
import { ICreateNotificationTemplateDto } from '@/types/notification/ICreateNotificationTemplateDto';
import { FunctionComponent } from 'preact';

export const TemplateNotificationPage: FunctionComponent = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dataJson, setDataJson] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    document.title = 'VX - Templates Notification';
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const res = await TemplateServiceFront.getTemplates();
    if (!res.getStatus()) return;
    setTemplates(res.getMany());
  };

  const handleCreate = async () => {
    try {
      let parsedData: Record<string, any> = {};
      if (dataJson.trim()) {
        parsedData = JSON.parse(dataJson);
      }

      const newTemplate: ICreateNotificationTemplateDto = {
        title,
        description,
        data: parsedData,
      };

      await TemplateServiceFront.createTemplate(newTemplate);
      setTitle('');
      setDescription('');
      setDataJson('');
      setError('');
      fetchTemplates();
      setShowForm(false);
    } catch (err: any) {
      console.error('Error creando plantilla:', err);
      setError('Error al crear plantilla. Asegúrate de que el JSON es válido.');
    }
  };

  return (
    <Section padding>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Plantillas de Notificación</h2>
        <Button
          name='create-template'
          label={showForm ? 'Cancelar' : '+ Nueva Plantilla'}
          icon='122'
          onClick={() => setShowForm((prev) => !prev)}
        />
      </div>

      {showForm && (
        <div className='border p-4 mb-6 rounded bg-gray-50 space-y-2'>
          <h4 className='text-md font-medium'>Nueva Plantilla</h4>

          <input
            type='text'
            placeholder='Título'
            value={title}
            onInput={(e) => setTitle(e.currentTarget.value)}
            className='w-full border px-3 py-2 rounded text-sm'
          />
          <textarea
            placeholder='Descripción'
            rows={2}
            value={description}
            onInput={(e) => setDescription(e.currentTarget.value)}
            className='w-full border px-3 py-2 rounded text-sm'
          ></textarea>
          <textarea
            placeholder='Data JSON'
            rows={3}
            value={dataJson}
            onInput={(e) => setDataJson(e.currentTarget.value)}
            className='w-full border px-3 py-2 rounded text-sm font-mono'
          ></textarea>

          {error && <p className='text-sm text-red-600'>{error}</p>}

          <Button
            name='submit-template'
            label='Guardar Plantilla'
            className='bg-cyan-600 text-white hover:bg-cyan-700 px-4 py-2 text-sm rounded'
            onClick={handleCreate}
          />
        </div>
      )}

      <div className='border rounded border-gray-200 bg-white shadow-sm divide-y'>
        {templates.map((tpl) => (
          <div key={tpl.id} className='p-4'>
            <h5 className='font-semibold'>{tpl.title}</h5>
            <p className='text-sm text-gray-600'>{tpl.description}</p>
            <pre className='text-xs text-gray-400 mt-1'>
              {JSON.stringify(tpl.data, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </Section>
  );
};
