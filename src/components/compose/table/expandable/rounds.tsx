import { type FunctionComponent } from 'preact';
import { IExpandableProps } from './interface';
import { Map } from '@/components/common/map/map';
import { useEffect, useState, useRef } from 'preact/hooks';
import QRCode from 'react-qr-code';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import { Button } from '@/components/common/button/button';
import shortUUID from 'short-uuid';

export const ExpandableRounds: FunctionComponent<IExpandableProps> = ({
  row,
}: IExpandableProps) => {
  const [qr, setQr] = useState('');
  const qrRef = useRef(null);

  useEffect(() => {
    const title = '';

    setQr(JSON.stringify(title));
  }, []);

  const handlePoint = async (data: any) => {
    const title = `Latitud: ${data.position.lat}, Longitud: ${data.position.lng}`;

    setQr(JSON.stringify(title));
  };

  const handleDownloadPDF = async () => {
    if (!qrRef.current) return;
    console.log(qr);

    try {
      const qrImage = await toPng(qrRef.current);
      const pdf = new jsPDF();

      pdf.addImage(qrImage, 'PNG', 1, 5, 230, 50); // Ajusta las coordenadas y tamaño según sea necesario

      pdf.save('qr-code.pdf');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  };

  return (
    <div>
      <div className='flex flex-col'>
        <div className='text-center'>
          <div ref={qrRef}>
            <h1>QR de ubicación de los punto</h1>
            <div className='grid grid-flow-col auto-cols-[200px]  gap-1  justify-center '>
              {row.points.map((item: any, index: string) => (
                <div class='p-1'>
                  <QRCode
                    size={256}
                    id={index}
                    style={{ height: '80%', width: '80%' }}
                    value={JSON.stringify({
                      roundId: row.id,
                      uuid: shortUUID.generate(),
                      pointId: item.id,
                      latitude: item.latitude,
                      longitude: item.longitude,
                    })}
                    viewBox={`0 0 256 256`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <Button
              onClick={handleDownloadPDF}
              type='button'
              icon='039'
              name='back'
              className='w-auto'
              label='Descargar QR'
            />
          </div>
        </div>
        <div className='text-center'>
          <h2>Ubicación de los punto en mapa</h2>
          {row.markers.length ? (
            <Map
              name='Map'
              pointsAmount={100}
              sendPoints={() => {}}
              pointsRef={row.markers ?? []}
              center={row.markers[0].position ?? []}
              condition={true}
              errorCondition='No tienes autorizado modificar puntos'
              radialPoint={null}
              errorRadialPoint=''
              width='100%'
              clickPoint={handlePoint}
            />
          ) : (
            <p>No hay puntos en la ronda </p>
          )}
        </div>
      </div>
    </div>
  );
};
