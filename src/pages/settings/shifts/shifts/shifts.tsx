import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { Section } from '@/components/common/section/section';
import { Select } from '@/components/common/select/select';
import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { ShiftService } from '@/services/shift';
import { toast } from 'react-toastify';

export const ShiftsSettingPage: FunctionComponent = () => {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    employee: '',
  });

  const handleFormatInputChange = (e: any) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const obj = {
      address: formData.address,
      city: formData.city,
      employee: formData.employee,
    };

    const request = await ShiftService.createShift({
      ...obj,
    });

    if (!request.getStatus()) return;

    toast.success('Ronda creada exitosamente!', {
      position: 'top-right',
    });

    console.log('Datos del formulario:', formData);
  };

  return (
    <Section className='flex flex-row'>
      <div className='w-full'>
        <div>
          <h1>Crear turno</h1>
        </div>
        <div className='flex flex-col gap-1 w-10/12'>
          <div className='grid grid-cols-2 gap-2'>
            <Input
              type='text'
              placeholder='Dirección'
              name='address'
              value={formData.address}
              onChange={handleFormatInputChange}
            />
            <Select
              name='city'
              placeholder='Ciudad'
              value={formData.city}
              onChange={handleFormatInputChange}
            />
            <Select
              name='employee'
              placeholder='Empleado'
              value={formData.employee}
              onChange={handleFormatInputChange}
            />
          </div>
          <div>
            <Button
              id='setting-close'
              name='setting-close'
              type='button'
              label='Guardar'
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </Section>
  );
};
