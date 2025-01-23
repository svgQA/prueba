import { Map } from '@/components/common/map/map';
import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Input } from '@/components/common/input/input';
import { Button } from '@/components/common/button/button';
import { toast } from 'react-toastify';
import { ShiftService } from '@/services/shift';
import { useLocation } from 'wouter';

export const PlaceCreateSettingPage: FunctionComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    markers: [],
  });
  const [_, navigate] = useLocation();

  const [points, setPoint] = useState<{ id: number; position: any }[]>([]);

  useEffect(() => {
    setPoint([]);
  }, []);

  const handleFormatInputChange = (e: any) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const sendPointsRef = (data: any) => {
    setPoint(data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const obj = {
      name: formData.name,
      code: 123,
      // description: formData.description,
      latitude: String(points[0].position.lat),
      longitude: String(points[0].position.lng),
    };

    const request = await ShiftService.createPlace({
      ...obj,
    });

    if (!request.getStatus()) return;

    toast.success('Lugar creado exitosamente!', {
      position: 'top-right',
    });

    navigate('/rounds/places');

    console.log('Datos del formulario:', request);
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
              placeholder='Nombre'
              label='Nombre'
              name='name'
              value={formData.name}
              onChange={handleFormatInputChange}
            />
            <Input
              type='text'
              placeholder='Descripción'
              name='description'
              label='Descripción'
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
          <Map
            name='Map'
            pointsAmount={1}
            sendPoints={sendPointsRef}
            pointsRef={points}
            condition={false}
            errorCondition=''
            radialPoint={null}
            errorRadialPoint=''
            draggable={true}
            clickPoint={() => {}}
          />
        </div>
      </div>
    </section>
  );
};
