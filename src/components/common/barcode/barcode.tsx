import { BarcodeProps } from './interface';
import { useRef, useState, useEffect } from 'preact/hooks';
import { Button } from '../button/button';
import { Html5Qrcode } from 'html5-qrcode';
import { IPresignedRequest } from '@/types/file';
import ShowFiles from '@/components/common/file/show.file';
import { DateUtils } from '@/utils/utilities/dates';
import { handleFileSaveWrapper } from '../file/utils/utils';

export const Barcode = ({
  value,
  name,
  label,
  disabled,
  onChange,
  page,
}: BarcodeProps) => {
  const [scannedValue, setScannedValue] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scanRegionId = 'barcode-reader-region';
  const [resources, setResources] = useState<IPresignedRequest[]>(
    Array.isArray(value) ? value : []
  );

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        try {
          html5QrCodeRef.current.stop();
        } catch {}
        try {
          html5QrCodeRef.current.clear();
        } catch {}
      }
    };
  }, []);

  const handleStartScan = async () => {
    setError(null);
    setScanning(true);
    setScannedValue(null);
    setCopied(false);

    try {
      if (!Html5Qrcode.getCameras) {
        setError('No se pudo acceder a la cámara: API no soportada');
        setScanning(false);
        return;
      }

      const cameras = await Html5Qrcode.getCameras();
      if (!cameras?.length) {
        setError('No se encontró ninguna cámara disponible');
        setScanning(false);
        return;
      }

      const cameraId = cameras[0].id;
      html5QrCodeRef.current = new Html5Qrcode(scanRegionId);

      await html5QrCodeRef.current.start(
        cameraId,
        {
          fps: 15,
          qrbox: { width: 320, height: 160 },
          aspectRatio: 1.7778,
        },
        (decodedText) => {
          setScannedValue(decodedText);
          setScanning(false);
          html5QrCodeRef.current?.stop().catch(() => {});
          html5QrCodeRef.current?.clear();
          onChange?.({
            target: { name, value: decodedText },
          } as any);
        },
        (err) => {
          if (!err?.includes('NotFoundException')) {
            console.warn('Error escaneo barcode:', err);
          }
        }
      );
    } catch (e: any) {
      setError('No se pudo acceder a la cámara: ' + e.message);
      setScanning(false);
    }
  };

  const handleStopScan = () => {
    setScanning(false);
    if (html5QrCodeRef.current) {
      try {
        html5QrCodeRef.current.stop();
      } catch {}
      try {
        html5QrCodeRef.current.clear();
      } catch {}
    }
  };

  const handleCopy = async () => {
    if (scannedValue) {
      try {
        await navigator.clipboard.writeText(scannedValue);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        const textArea = document.createElement('textarea');
        textArea.value = scannedValue;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleSaveBarcode = async () => {
    if (!scannedValue) return;

    // Crear una imagen con el código de barras escaneado
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 100;

    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000000';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(scannedValue, canvas.width / 2, canvas.height / 2);
    }

    canvas.toBlob(async (blob) => {
      if (blob) {
        const file = new File(
          [blob],
          `${DateUtils.dateToBackend(new Date())}-barcode.png`,
          {
            type: 'image/png',
          }
        );

        await handleFileSaveWrapper(
          file,
          `${DateUtils.dateToBackend(new Date())}-barcode.png`,
          'image/png',
          emitChange,
          'form'
        );
      }
    });
  };

  const emitChange = (dataset: any, file: any) => {
    setResources((prev) => [...prev, file]);
    const safeValue = Array.isArray(value) ? value : [];
    let realDataset = dataset;

    if (dataset == null || dataset == undefined) {
      realDataset = { page };
    }
    onChange?.({
      target: {
        name: name,
        type: 'file',
        dataset: realDataset,
        value: [...safeValue, file],
      },
    });
  };

  const handleRemove = (uuid: string) => {
    setResources((prev) => prev.filter((file) => file.uuid !== uuid));
  };

  return (
    <div className='w-full h-full flex flex-col items-center'>
      {label && <label className='mb-2 font-medium'>{label}</label>}
      {onChange && (
        <Button
          name='btn-response-barcode'
          type='button'
          className='mb-2 px-3 py-1 bg-primary text-white rounded disabled:opacity-50'
          onClick={handleStartScan}
          disabled={disabled || scanning}
          label={scanning ? 'Escaneando...' : 'Escanear Código de Barras'}
        />
      )}
      {error && <div className='text-red-500 text-sm mb-2'>{error}</div>}
      {scanning && (
        <div className='mb-2 flex flex-col items-center'>
          <div
            id={scanRegionId}
            style={{
              width: 300,
              height: 100,
              borderRadius: 8,
              overflow: 'hidden',
            }}
          />
          <Button
            name='btn-response-barcode-cancel'
            type='button'
            className='mt-2 px-2 py-1 bg-gray-200 rounded'
            onClick={handleStopScan}
            label='Cancelar'
          />
        </div>
      )}
      {scannedValue && (
        <div className='mt-4 p-4 border rounded-lg bg-white shadow-sm w-full max-w-sm'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='font-bold text-green-600'>
              ✓ Código de Barras Detectado
            </h3>
            <Button
              name='btn-copy-barcode'
              type='button'
              className='px-2 py-1 bg-blue-500 text-white text-xs rounded'
              onClick={handleCopy}
              label={copied ? 'Copiado!' : 'Copiar'}
            />
          </div>
          <div className='bg-gray-50 p-3 rounded text-sm break-all'>
            {scannedValue}
          </div>
          <div className='mt-4 flex flex-col items-center'>
            <Button
              name='btn-save-barcode'
              type='button'
              className='mt-2 px-3 py-1 bg-primary text-white rounded'
              onClick={handleSaveBarcode}
              label='Guardar Código'
              disabled={disabled}
            />
          </div>
        </div>
      )}
      {resources.length > 0 && (
        <ShowFiles resources={resources} removeFile={handleRemove} />
      )}
    </div>
  );
};
