import { useEffect, useState } from 'preact/hooks';
import { useParams, useLocation } from 'wouter';
import { TemplateService } from '@/services';
import { ICreateNotificationTemplateDto } from '@/types/notification/ICreateNotificationTemplateDto';
// import { Section } from '@/components/common/section/section';
import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { useSignal } from '@preact/signals';
import { Section } from '@/components/common/section/section';

export const TemplateNotificationEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Partial<ICreateNotificationTemplateDto>>({});
  const [jsonError, setJsonError] = useState('');
  const loading = useSignal<boolean>(false);
  const [_, navigate] = useLocation();

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      loading.value = true;
      const res = await TemplateService.getTemplateById(id);
      if (res.getStatus()) {
        setForm(res.getOne());
      }
      loading.value = false;
    };
    fetchData();
  }, [id]);

  const handleChange = (
    field: keyof ICreateNotificationTemplateDto,
    value: any
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    loading.value = true;
    if (jsonError) {
      alert('Corrige el JSON antes de guardar');
      loading.value = false;
      return;
    }

    const res = await TemplateService.updateTemplate(id, form);

    if (res.getStatus()) {
      alert('Plantilla actualizada correctamente');
      navigate('/notification/template');
    } else {
      alert('Error al actualizar la plantilla');
    }
    loading.value = false;
  };

  return (
    <Section loading={loading.value}>
      <div className='flex justify-end gap-4 absolute top-14 right-2'>
        <Button
          name='save-template'
          label='Guardar'
          className='bg-primary text-white p-2'
          icon='022'
          onClick={handleSubmit}
          disabled={loading.value}
        />
      </div>
      <h2 className='text-xl font-bold mb-4'>
        Editar Plantilla de Notificación
      </h2>
      <div className='grip grid-cols-2'>
        <Input
          name='title'
          label='Título'
          value={form.title || ''}
          onChange={(e) => handleChange('title', e.currentTarget.value)}
        />
        <TextArea
          name='description'
          label='Descripción'
          value={form.description || ''}
          onChange={(e) => handleChange('description', e.currentTarget.value)}
        />
        <TextArea
          name='data'
          label='Data (JSON)'
          value={JSON.stringify(form.data || {}, null, 2)}
          onChange={(e) => {
            const value = e.currentTarget.value;
            try {
              const parsed = JSON.parse(value);
              handleChange('data', parsed);
              setJsonError('');
            } catch (err: any) {
              setJsonError('JSON inválido');
            }
          }}
        />
        {jsonError && <p className='text-red-600 text-sm'>{jsonError}</p>}
      </div>
    </Section>
  );
};
