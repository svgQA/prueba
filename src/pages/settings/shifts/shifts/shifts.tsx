import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { Section } from '@/components/common/section/section';
import { Select } from '@/components/common/select/select';
import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { ShiftService } from '@/services/shift';
import { toast } from 'react-toastify';
import { UserService } from '@/services/user';

export const ShiftsSettingPage: FunctionComponent = () => {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    employee: '',
    start: '',
    end: '',
    round: ''
  });
  const [employees, setEmployees] = useState([]);
  const [rounds, setRounds] = useState([]);

  useEffect(() => {
    getUsers();
    getRounds();
  }, []);

  const getRounds = async () => {
    const request: any = await ShiftService.getRounds();

    const roundsMap = request.data.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
        ...item
      }
    })
    setRounds(roundsMap);
  }

  const getUsers = async () => {
    const request: any = await UserService.get_all();

    const employeesMap = request.data.map((item: any) => {
      return {
        label: item.name + ' ' + item.surname,
        value: item.cognitoId,
        ...item
      }
    })
    setEmployees(employeesMap);
  }

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
      employee: formData.employee,
      start: new Date(formData.start),
      end: new Date(formData.end),
      roundId: Number(formData.round),
      userId: formData.employee,
      tasks: [],
      extraData: {}
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

  const selectEmployee = async (e: any) => {
    handleFormatInputChange(e);
    const employeeRef: any = employees.find((item: any) => item.cognitoId === e.target.value);

    setFormData({
      ...formData,
      employee: employeeRef.cognitoId
    });
  }

  const selectRound = async (e: any) => {
    handleFormatInputChange(e);
    const roundRef: any = rounds.find((item: any) => item.id === e.target.value);

    setFormData({
      ...formData,
      round: roundRef.id
    });
  }

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
              placeholder='Descripción'
              label='Descripción'
              name='address'
              value={formData.address}
              onChange={handleFormatInputChange}
            />
            <Input
              type='date'
              placeholder='Fecha de inicio'
              label='Fecha de inicio'
              name='start'
              value={formData.start}
              onChange={handleFormatInputChange}
            />
            <Input
              type='date'
              placeholder='Fecha de terminación'
              label='Fecha de terminación'
              name='end'
              value={formData.end}
              onChange={handleFormatInputChange}
            />
            <Select
              name='name'
              placeholder='Empleado'
              label='Empleado'
              value={formData.employee}
              options={employees}
              onChange={selectEmployee}
            />
            <Select
              name='round'
              placeholder='Ronda'
              label='Ronda'
              value={formData.round}
              options={rounds}
              onChange={selectRound}
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
