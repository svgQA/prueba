import { Map } from '@/components/common/map/map';
import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { Input } from '@/components/common/input/input';
import { Button } from '@/components/common/button/button';
import { toast } from 'react-toastify';
import { ShiftService } from '@/services/shift';

export const PlaceCreateSettingPage: FunctionComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    markers: [],
  });

  const [markers, setMarkers] = useState<{ id: number; position: any }[]>([]);

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
      name: formData.name,
      description: formData.description,
      latitude: markers[0].position.lat,
      longitude: markers[0].position.lng,
    };

    const request = await ShiftService.createPlace({
      ...obj,
    });

    if (!request.getStatus()) return;

    toast.success('Lugar creado exitosamente!', {
      position: 'top-right',
    });

    console.log('Datos del formulario:', obj);
  };

  const addPlace = (data: any) => {
    const markers = [];
    const marker = {
      id: 1,
      position: {
        lat: data.latitude,
        lng: data.longitude,
      },
    };
    markers.push(marker);
    setMarkers(markers);
  };

  return (
    <section className='flex flex-row'>
      <div className='w-full'>
        <div>
          <h1>Crear nuevo lugar</h1>
        </div>
        <div className='flex flex-col gap-1 w-10/12'>
          <div className='grid grid-cols-2 gap-2'>
            <Input
              type='text'
              placeholder='Tiempo del lugar'
              name='name'
              value={formData.name}
              onChange={handleFormatInputChange}
            />
            <Input
              type='text'
              placeholder='Descripción del lugar'
              name='description'
              value={formData.description}
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
        <div>
          <Map name='Map' addPlaceEvent={addPlace} markers={markers} />
        </div>
      </div>
    </section>
  );
};
