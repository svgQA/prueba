import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { Map } from '@/components/common/map/map';
import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { toast } from "react-toastify";

export const RoundCreateSettingPage: FunctionComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    time: '',
    distance: '',
    frequency: '',
    markers: []
  });

  const handleFormatInputChange = (e: any) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    toast.success("Ronda creada exitosamente!", {
      position: "top-right",
    });

    console.log('Datos del formulario:', formData);
  };

  const addPlace = () => {}

  return (
    <section className='flex flex-row'>
      <div className='w-full'>
        <div>
          <h1>Crear nueva ronda</h1>
        </div>
        <div className='flex flex-col gap-1 w-10/12'>
          <Input
            type='text'
            placeholder='Nombre de la ronda'
            name='name'
            value={formData.name}
            onChange={handleFormatInputChange}
          />

          <div className='grid grid-cols-2 gap-2'>
            <Input
              type='text'
              placeholder='Tiempo de la ronda'
              name='time'
              value={formData.time}
              onChange={handleFormatInputChange}
            />
            <Input
              type='text'
              placeholder='Distancia de la ronda'
              name='distance'
              value={formData.distance}
              onChange={handleFormatInputChange}
            />
            <Input
              type='text'
              placeholder='Frecuencia de la ronda'
              name='frequency'
              value={formData.frequency}
              onChange={handleFormatInputChange}
            />
            <Input
              type='text'
              placeholder='Seleccionar un lugar'
              name='label'
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
        <div>
          <Map
            name='mapa'
            addPlaceEvent={addPlace}
            markers={formData.markers}
          />
        </div>
      </div>
    </section>
  );
};
