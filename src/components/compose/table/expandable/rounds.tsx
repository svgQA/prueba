import { type FunctionComponent } from 'preact';
import { IExpandableProps } from './interface';
import { useEffect, useState, useRef } from 'preact/hooks';
import QRCode from 'react-qr-code';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import { Button } from '@/components/common/button/button';
import shortUUID from 'short-uuid';
import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import { ToastManager } from '@/utils/toast/toast-manager';

export const ExpandableRounds: FunctionComponent<IExpandableProps> = ({
  row,
}: IExpandableProps) => {
  const [_qr, setQr] = useState('');
  const qrRef = useRef(null);

  useEffect(() => {
    const title = '';

    setQr(JSON.stringify(title));
  }, []);

  /* const handlePoint = async (data: any) => {
    const title = `Latitud: ${data.position.lat}, Longitud: ${data.position.lng}`;

    setQr(JSON.stringify(title));
  };*/

  const handleDownloadPDF = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!qrRef.current) return;
    try {
      // Generar imágenes de alta calidad para cada QR individualmente
      const qrImages = await Promise.all(
        row.points.map(async (point: any) => {
          const qrElement = document.getElementById(`qr-${point.id}`);
          if (!qrElement) return null;

          return {
            image: await toPng(qrElement, {
              quality: 1.0,
              pixelRatio: 4, // Aumentamos la resolución
              style: {
                transform: 'scale(1)',
                transformOrigin: 'top left',
              },
            }),
            point,
          };
        })
      );

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Configuración del grid de QR
      const qrSize = 45; // Tamaño de cada QR en mm
      const margin = 15; // Margen de la página
      const spacing = 10; // Espacio entre QR

      // Calcular cuántos QR caben por fila y columna
      const qrsPerRow = Math.floor(
        (pageWidth - 2 * margin) / (qrSize + spacing)
      );
      const qrsPerColumn = Math.floor(
        (pageHeight - 2 * margin) / (qrSize + spacing + 15)
      ); // +15 para el texto

      let currentPage = 0;
      let currentRow = 0;
      let currentCol = 0;

      // Función para agregar un nuevo QR al PDF
      const addQRToPDF = (qrData: { image: string; point: any }) => {
        if (currentCol >= qrsPerRow) {
          currentCol = 0;
          currentRow++;
        }

        if (currentRow >= qrsPerColumn) {
          pdf.addPage();
          currentPage++;
          currentRow = 0;
          currentCol = 0;
        }

        const x = margin + currentCol * (qrSize + spacing);
        const y = margin + currentRow * (qrSize + spacing + 15);

        // Agregar el QR
        pdf.addImage(
          qrData.image,
          'PNG',
          x,
          y,
          qrSize,
          qrSize,
          `qr-${qrData.point.id}`,
          'FAST'
        );

        // Agregar información del punto
        pdf.setFontSize(8);
        const textY = y + qrSize + 5;
        pdf.text(`ID: ${qrData.point.id}`, x + qrSize / 2, textY, {
          align: 'center',
        });
        pdf.text(`Lat: ${qrData.point.latitude}`, x + qrSize / 2, textY + 4, {
          align: 'center',
        });
        pdf.text(`Lng: ${qrData.point.longitude}`, x + qrSize / 2, textY + 8, {
          align: 'center',
        });

        currentCol++;
      };

      // Agregar cada QR al PDF
      for (const qrData of qrImages) {
        if (qrData) {
          addQRToPDF(qrData);
        }
      }

      pdf.save('qr-codes.pdf');
      ToastManager.success('PDF generado correctamente');
    } catch {
      ToastManager.error('Error al generar el PDF');
    }
  };

  return (
    <div>
      <div className='flex flex-col'>
        <div className='text-center flex flex-row justify-between w-full items-center mb-2'>
          <div ref={qrRef} className='w-10/12 print:block'>
            <div className='flex flex-row gap-1 justify-center flex-wrap print:block'>
              {row.points.map((item: any, index: string) => (
                <div
                  className='p-1 w-32 h-32 print:w-[45mm] print:h-[45mm] print:break-inside-avoid'
                  key={`point-qr-${row.id}-${index}`}
                >
                  <div id={`qr-${item.id}`}>
                    <QRCode
                      size={512} // Aumentamos el tamaño base para mejor calidad
                      id={`qr-${item.id}`}
                      style={{
                        height: '100%',
                        width: '100%',
                        aspectRatio: '1/1',
                        objectFit: 'contain',
                      }}
                      value={JSON.stringify({
                        roundId: row.id,
                        uuid: shortUUID.generate(),
                        pointId: item.id,
                        latitude: item.latitude,
                        longitude: item.longitude,
                      })}
                      viewBox={`0 0 512 512`}
                    />
                  </div>
                  <div className='hidden print:block text-center mt-2'>
                    <p className='text-sm'>Punto ID: {item.id}</p>
                    <p className='text-xs'>Lat: {item.latitude}</p>
                    <p className='text-xs'>Lng: {item.longitude}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='w-2/12 print:hidden'>
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
        <div className='text-center w-full'>
          {row.markers.length && (
            <MapLibrePointsMap
              pointsRef={row.markers}
              sendPoints={() => {}}
              name='map-points'
              center={{
                lat: row.markers[0].position.lat,
                lng: row.markers[0].position.lng,
              }}
              pointsAmount={1}
              condition={false}
              errorCondition=''
              radialPoint={null}
              errorRadialPoint=''
              draggable={true}
              clickPoint={() => {}}
              disablePointSelection={true}
              //clickPoint={handlePoint}
            />
          )}
        </div>
      </div>
    </div>
  );
};
