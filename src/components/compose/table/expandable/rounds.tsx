import { type FunctionComponent } from 'preact';
import { IExpandableProps } from './interface';
import { Map } from '@/components/common/map/map';
import { useEffect, useState, useRef } from 'preact/hooks';
import QRCode from 'react-qr-code';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import { Button } from '@/components/common/button/button';

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

    try {
      const qrImage = await toPng(qrRef.current);
      const pdf = new jsPDF();

      pdf.addImage(qrImage, 'PNG', 10, 10, 150, 100); // Ajusta las coordenadas y tamaño según sea necesario

      pdf.save('qr-code.pdf');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  };

  return (
    <div>
      <div className='flex flex-column'>
        <div className='w-1/2'>
          <div ref={qrRef}>
            <h2>QR de ubicación del punto</h2>
            <QRCode
              size={256}
              style={{ height: '50%', width: '50%' }}
              value={qr}
              viewBox={`0 0 256 256`}
            />
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
        <div className='w-1/2'>
          <div className='w-full'>
            <Map
              name='Map'
              pointsAmount={100}
              sendPoints={() => {}}
              pointsRef={row.markers ?? []}
              condition={true}
              errorCondition='No tienes autorizado modificar puntos'
              radialPoint={null}
              errorRadialPoint=''
              width='500px'
              clickPoint={handlePoint}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
