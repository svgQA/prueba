import { Map } from '@/components/common/map/map';
import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Input } from '@/components/common/input/input';
import { Button } from '@/components/common/button/button';
import { toast } from 'react-toastify';
import { ShiftService } from '@/services/shift';
import { useLocation } from 'wouter';
import { Select } from '@/components/common/select/select';

export const PlaceCreateSettingPage: FunctionComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    markers: [],
    deparment: '',
    municipality: '',
    type: '',
    address: ''
  });
  const [_, navigate] = useLocation();
  const [departments, setDepartments] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [types, setTypes] = useState([]);

  const [points, setPoint] = useState<{ id: number; position: any }[]>([]);

  useEffect(() => {
    setPoint([]);
    getDepartments();
    getProjects();
    getTypes();
  }, []);

  const getTypes = () => {
    const typesRef: any = [
      {
        value: 'INDUSTRIAL',
        label: 'Industrial'
      },
      {
        value: 'RESIDENTIAL',
        label: 'Residencial'
      },
      {
        value: 'OTHER',
        label: 'Otros'
      }
    ];

    setTypes(typesRef)
  }

  const getProjects = async () => {
    const request: any = await ShiftService.getProjects();

    console.log('getProjects:', request.data)
  }

  const getDepartments = async () => {
    const request: any = await ShiftService.getDepartments();

    const requestRef = request.data.map((item: any) => {
      return {
        ...item,
        value: item.id,
        label: item.name
      }
    })
    setDepartments(requestRef);
  }

  const getMunicipalities = async (id: string) => {
    const request: any = await ShiftService.getMunicipalities(id);

    const requestRef = request.data.map((item: any) => {
      return {
        ...item,
        label: item.name,
        value: item.id
      }
    });

    setMunicipalities(requestRef)
  }

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
      description: formData.description,
      latitude: String(points[0].position.lat),
      longitude: String(points[0].position.lng),
      address: formData.address,
      state: 'ACTIVE',
      type: formData.type,
      municipalityId: Number(formData.deparment),
      projectId: 1,
      workstation: []
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

  const selectDepartment = async (event: any) => {
    handleFormatInputChange(event);
    await getMunicipalities(event.target.value);
  }

  const selectMunicipality = async (event: any) => {
    handleFormatInputChange(event);
  }

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
              placeholder='Dirección'
              label='Dirección'
              name='address'
              value={formData.address}
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
            <Select
              name='deparment'
              placeholder='Departamento'
              label='Departamento'
              value={formData.deparment}
              options={departments}
              onChange={selectDepartment}
            />
            <Select
              name='municipality'
              placeholder='Municipio'
              label='Municipio'
              value={formData.municipality}
              options={municipalities}
              onChange={selectMunicipality}
            />
            <Select
              name='type'
              placeholder='Tipo'
              label='Tipo'
              value={formData.type}
              options={types}
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
