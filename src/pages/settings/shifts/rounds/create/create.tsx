import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { Map } from '@/components/common/map/map';
import { FunctionComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { toast } from 'react-toastify';
import { ShiftService } from '@/services/shift';
import { Select } from '@/components/common/select/select';
import { useLocation } from 'wouter';

export const RoundCreateSettingPage: FunctionComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    frequency: '',
    place: '',
    latitude: '',
    longitude: '',
  });

  const [points, setPoint] = useState<{ id: number; position: any }[]>([]);
  const [place, setPlace] = useState<{ id: number; position: any }>();
  const [places, setPlaces] = useState<any[]>([]);
  const [addPoint, setAddPoint] = useState<boolean>(false);
  const [_, navigate] = useLocation();

  const handleFormatInputChange = (e: any) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    setPoint([]);
  }, []);

  const sendPointsRef = (data: any) => {
    setPoint(data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const pointsRef = points.map((item: any) => {
      return {
        latitude: String(item.position.lat),
        longitude: String(item.position.lng),
      };
    });

    const obj = {
      name: formData.name,
      // frequency: formData.frequency,
      placeId: place?.id,
      points: pointsRef,
    };

    const request = await ShiftService.createRound({
      ...obj,
    });

    if (!request.getStatus()) return;

    toast.success('Ronda creada exitosamente!', {
      position: 'top-right',
    });

    navigate('/rounds');
  };

  const addPlace = (data: any) => {
    const marker = {
      id: points.length + 1,
      position: {
        lat: data.latitude,
        lng: data.longitude,
      },
    };

    const pointValidation = haversineDistance(place, marker);

    if (pointValidation) {
      toast.error('Punto de la ronda fuera del radio del lugar', {
        position: 'top-right',
      });

      return false;
    }

    setPoint((prevMarkers) => [...prevMarkers, marker]);
    return true;
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

    return R * c > 1000;
  };

  const selectPlace = async (e: any) => {
    handleFormatInputChange(e);
    setPoint([]);

    const { value } = e.target;

    const newMarker = places.find((item: any) => item.value === Number(value));

    const marker = {
      id: newMarker.value,
      position: {
        lat: newMarker.latitude,
        lng: newMarker.longitude,
      },
    };

    setPlace(marker);
    setPoint([marker]);
  };

  const getPlaces = async () => {
    const request: any = await ShiftService.getPlaces();
    setPlaces(request.data);

    const placesData = request.data.map((item: any) => {
      return {
        value: item.id,
        label: item.name,
        description: item.name,
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
      };
    });

    setPlaces(placesData);
  };

  const savePoint = () => {
    if (points.length === 0) {
      toast.error('Debes seleccionar un lugar para agregar puntos', {
        position: 'top-right',
      });

      return true;
    }

    const data = {
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
    };

    const validation = addPlace(data);

    if (!validation) return;

    setAddPoint(false);

    setFormData({
      ...formData,
      latitude: '',
      longitude: '',
    });
  };

  const validatePoint = (): boolean => {
    return !!(points.length === 0);
  };

  const addPointValidation = () => {
    if (points.length === 0) {
      toast.error('Debes seleccionar un lugar para agregar puntos', {
        position: 'top-right',
      });

      return;
    }

    setAddPoint(true);
  };

  useEffect(() => {
    getPlaces();
  }, []);

  return (
    <section className='flex flex-row'>
      <div className='w-full'>
        <div>
          <h1>Crear nueva ronda</h1>
        </div>
        <div className='flex'>
          <div className='w-1/2'>
            <Input
              type='text'
              placeholder='Nombre'
              label='Nombre'
              name='name'
              value={formData.name}
              onChange={handleFormatInputChange}
            />
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
            <Button
              id='setting-close'
              name='setting-close'
              type='button'
              label='Guardar'
              onClick={handleSubmit}
              className='mt-2 mb-2'
            />
          </div>
          <div className='w-1/2 ml-5'>
            <h2>Agregar punto por coordenadas</h2>
            {!addPoint && (
              <Button
                id='setting-close'
                name='setting-close'
                type='button'
                label='Agregar punto'
                onClick={addPointValidation}
              />
            )}

            {addPoint && (
              <div>
                <Input
                  type='number'
                  placeholder='Latitud'
                  label='Latitud'
                  name='latitude'
                  value={formData.latitude}
                  onChange={handleFormatInputChange}
                />
                <Input
                  type='number'
                  placeholder='Longitud'
                  label='Longitud'
                  name='longitude'
                  value={formData.longitude}
                  onChange={handleFormatInputChange}
                />
                <Button
                  id='setting-close'
                  name='setting-close'
                  type='button'
                  label='Guardar punto'
                  onClick={savePoint}
                />
                <Button
                  id='setting-close'
                  name='setting-close'
                  type='button'
                  label='Cancelar'
                  onClick={() => {
                    setAddPoint(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <div>
          <Map
            name='Map'
            pointsAmount={100}
            sendPoints={sendPointsRef}
            pointsRef={points}
            condition={validatePoint()}
            errorCondition='Debes seleccionar un lugar para agregar puntos'
            radialPoint={place}
            errorRadialPoint='Punto de la ronda fuera del radio del lugar'
            draggable={true}
            clickPoint={() => {}}
          />
        </div>
      </div>
    </section>
  );
};
