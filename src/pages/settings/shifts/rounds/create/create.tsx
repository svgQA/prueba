import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { Map } from '@/components/common/map/map';
import { FunctionComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { toast } from 'react-toastify';
import { ShiftService } from '@/services/shift';
import { Select } from '@/components/common/select/select';

export const RoundCreateSettingPage: FunctionComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    frequency: '',
    place: '',
  });

  const [markers, setMarkers] = useState<{ id: number; position: any }[]>([]);
  const [place, setPlace] = useState<{ id: number; position: any }>();
  const [places, setPlaces] = useState<any[]>([]);

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
      frequency: formData.frequency,
      markers: markers,
      place: formData.place
    };

    const request = await ShiftService.createRound({
      ...obj,
    });

    if (!request.getStatus()) return;

    toast.success('Ronda creada exitosamente!', {
      position: 'top-right',
    });

    console.log('Datos del formulario:', formData);
  };

  const addPlace = (data: any) => {
    const marker = {
      id: markers.length + 1,
      position: {
        lat: data.latitude,
        lng: data.longitude,
      },
    };

    if (markers.length === 0) {
      toast.error('Debes seleccionar un lugar para agregar puntos', {
        position: 'top-right',
      });

      return;
    }

    const pointValidation = haversineDistance(place, marker);

    if (pointValidation) {
      toast.error('Punto de la ronda fuera del radio del lugar', {
        position: 'top-right',
      });

      return;
    }

    setMarkers((prevMarkers) => [...prevMarkers, marker]);
  };

  const haversineDistance = (markerReference: any, marker: any) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371e3;
    const φ1 = toRad(markerReference.position.lat);
    const φ2 = toRad(marker.position.lat);
    const Δφ = toRad(marker.position.lat - markerReference.position.lat);
    const Δλ = toRad(marker.position.lng - markerReference.position.lng);
  
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return (R * c) > 1000;
  };

  const selectPlace = async(e: any) => {
    handleFormatInputChange(e);
    setMarkers([]);

    const { value } = e.target;

    const newMarker = places.find((item: any) => item.value === Number(value));

    const marker = {
      id: 1,
      position: {
          lat: newMarker.latitude,
          lng: newMarker.longitude,
      }
    };

    setPlace(marker);
    setMarkers((prevMarkers) => [...prevMarkers, marker])
  }

  const getPlaces = async() => {
    const places = [
      {
        value: 1,
        label: 'Bogota',
        description: 'Centro comercial',
        latitude: 4.670343272976993,
        longitude: -74.0871440295104
      }
    ];

    setPlaces(places);
  }

  useEffect(() => {
    getPlaces();
  }, []); 

  return (
    <section className='flex flex-row'>
      <div className='w-full'>
        <div>
          <h1>Crear nueva ronda</h1>
        </div>
        <div className='flex flex-col gap-1 w-10/12'>
          <Input
            type='text'
            placeholder='Nombre'
            label='Nombre'
            name='name'
            value={formData.name}
            onChange={handleFormatInputChange}
          />

          <div className='grid grid-cols-2 gap-2'>
            <Input
              type='number'
              placeholder='Frecuencia'
              label='Frecuencia'
              name='frequency'
              value={formData.frequency}
              onChange={handleFormatInputChange}
            />
            <Select
              name='place'
              placeholder='Lugar'
              label='Lugar'
              value={formData.place}
              options={places}
              onChange={selectPlace}
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
            markers={markers}
          />
        </div>
      </div>
    </section>
  );
};
