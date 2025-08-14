import { useState, useEffect } from 'preact/hooks';
import { ICreateNotificationTemplateDto } from '@/types/notification/ICreateNotificationTemplateDto';
import { useTranslation } from 'react-i18next';
import { TemplateService } from '@/services';

export const TemplateManager = () => {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dataJson, setDataJson] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const res = await TemplateService.getTemplates();
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

      await TemplateService.createTemplate(newTemplate);
      setTitle('');
      setDescription('');
      setDataJson('');
      setError('');
      fetchTemplates();
    } catch (err: any) {
      console.error(t('s_error_template'), err);
      setError(t('s_error_template_invalid'));
    }
  };

  return (
    <div className='space-y-4'>
      <h4 className='text-md font-medium'>{t('h_management')}</h4>

      <div className='border rounded border-gray-200 bg-white shadow-sm divide-y'>
        {templates?.map((tpl) => (
          <div key={tpl.id} className='p-4'>
            <h5 className='font-semibold'>{tpl.title}</h5>
            <p className='text-sm text-gray-600'>{tpl.description}</p>
            <pre className='text-xs text-gray-400 mt-1'>
              {JSON.stringify(tpl.data, null, 2)}
            </pre>
          </div>
        ))}
      </div>

      <div className='border-t pt-4'>
        <h5 className='text-sm font-semibold mb-2'>Nueva plantilla</h5>
        <div className='space-y-2'>
          <input
            type='text'
            placeholder={t('p_titlePlaceholder')}
            value={title}
            onInput={(e) => setTitle(e.currentTarget.value)}
            className='w-full border px-3 py-2 rounded text-sm'
          />
          <textarea
            placeholder={t('p_descriptionPlaceholder')}
            rows={2}
            value={description}
            onInput={(e) => setDescription(e.currentTarget.value)}
            className='w-full border px-3 py-2 rounded text-sm'
          ></textarea>
          <textarea
            placeholder={t('p_dataJsonPlaceholder')}
            rows={3}
            value={dataJson}
            onInput={(e) => setDataJson(e.currentTarget.value)}
            className='w-full border px-3 py-2 rounded text-sm font-mono'
          ></textarea>

          {error && <p className='text-sm text-red-600'>{error}</p>}

          <button
            onClick={handleCreate}
            className='px-4 py-2 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700'
          >
            {t('p_saveButton')}
          </button>
        </div>
      </div>
    </div>
  );
};
