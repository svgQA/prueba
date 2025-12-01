import { QrProps } from './interface';
import QRCode from 'react-qr-code';
import { useRef, useState, useEffect } from 'preact/hooks';
import { Button } from '../button/button';
import { Html5Qrcode } from 'html5-qrcode';
import { IPresignedRequest } from '@/types/file';
import ShowFiles from '@/components/common/file/show.file';
import { DateUtils } from '@/utils/utilities/dates';
import { handleFileSaveWrapper } from '../file/utils/utils';
import { useTranslation } from 'react-i18next';

export const QrCode = ({
  value,
  name,
  label,
  disabled,
  onChange,
  page,
}: QrProps) => {
  const { t } = useTranslation();
  const [scannedValue, setScannedValue] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const qrRegionId = 'qr-reader-region';
  const [resources, setResources] = useState<IPresignedRequest[]>(
    Array.isArray(value) ? value : []
  );

  useEffect(() => {
    // Cleanup on unmount
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
    if (
      !window.confirm('¿Deseas activar la cámara para escanear un código QR?')
    ) {
      return;
    }
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
      if (!cameras || cameras.length === 0) {
        setError('No se encontró ninguna cámara disponible');
        setScanning(false);
        return;
      }
      const cameraId = cameras[0].id;
      html5QrCodeRef.current = new Html5Qrcode(qrRegionId);
      await html5QrCodeRef.current.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
        },
        (decodedText) => {
          setScannedValue(decodedText);
          setScanning(false);
          if (html5QrCodeRef.current) {
            html5QrCodeRef.current.stop();
            html5QrCodeRef.current.clear();
          }
          if (onChange) {
            onChange({
              target: {
                name,
                value: decodedText,
              },
            } as any);
          }
        },
        (_err) => {
          // Opcional: puedes mostrar errores de escaneo aquí
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
        // Fallback para navegadores que no soportan clipboard API
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

  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  const handleOpenUrl = () => {
    if (scannedValue && isUrl(scannedValue)) {
      window.open(scannedValue, '_blank');
    }
  };

  // Utilidad para convertir un SVG a PNG usando un canvas auxiliar
  const svgToPngFile = async (svgElement: SVGSVGElement, filename: string) => {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const svg64 = btoa(unescape(encodeURIComponent(svgString)));
    const image64 = 'data:image/svg+xml;base64,' + svg64;
    return new Promise<File>((resolve) => {
      const img = new window.Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = svgElement.width.baseVal.value || 128;
        canvas.height = svgElement.height.baseVal.value || 128;
        const ctx = canvas.getContext('2d');
        ctx!.fillStyle = '#fff';
        ctx!.fillRect(0, 0, canvas.width, canvas.height);
        ctx!.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], filename, { type: 'image/png' }));
          }
        }, 'image/png');
      };
      img.src = image64;
    });
  };

  const handleSaveQr = async () => {
    const svg = document.querySelector('.qr-preview svg') as SVGSVGElement;
    if (!svg) return;
    const filename = `${DateUtils.dateToBackend(new Date())}-qr.png`;
    const file = await svgToPngFile(svg, filename);
    if (!file) return;

    await handleFileSaveWrapper(
      file,
      `${DateUtils.dateToBackend(new Date())}-qr.png`,
      'image/png',
      emitChange,
      'form'
    );
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
      {label && <label className='mb-2 font-medium'>{t(label)}</label>}
      {value && <label className='mb-2 font-medium'>{value}</label>}
      {onChange && !value && (
        <Button
          name='btn-response-qr'
          type='button'
          className='mb-2 px-3 py-1 bg-primary text-white rounded disabled:opacity-50'
          onClick={handleStartScan}
          disabled={disabled || scanning}
          label={scanning ? 'Escaneando...' : 'Escanear QR'}
        />
      )}
      {error && <div className='text-red-500 text-sm mb-2'>{error}</div>}
      {scanning && (
        <div className='mb-2 flex flex-col items-center'>
          <div
            id={qrRegionId}
            style={{
              width: 220,
              height: 220,
              borderRadius: 8,
              overflow: 'hidden',
            }}
          />
          <Button
            name='btn-response-qr-cancel'
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
            <h3 className='font-bold text-green-600'>✓ QR Detectado</h3>
            <div className='flex gap-2'>
              <Button
                name='btn-copy-qr'
                type='button'
                className='px-2 py-1 bg-blue-500 text-white text-xs rounded'
                onClick={handleCopy}
                label={copied ? 'Copiado!' : 'Copiar'}
              />
              {isUrl(scannedValue) && (
                <Button
                  name='btn-open-url'
                  type='button'
                  className='px-2 py-1 bg-green-500 text-white text-xs rounded'
                  onClick={handleOpenUrl}
                  label='Abrir'
                />
              )}
            </div>
          </div>
          <div className='bg-gray-50 p-3 rounded text-sm break-all'>
            {scannedValue}
          </div>
          <div className='mt-4 flex flex-col items-center qr-preview'>
            <div className='bg-white p-3 rounded border'>
              <QRCode
                value={scannedValue}
                size={128}
                level='M'
                fgColor='#000000'
                bgColor='#FFFFFF'
                title='QR Code'
              />
            </div>
            <Button
              name='btn-save-qr'
              type='button'
              className='mt-2 px-3 py-1 bg-primary text-white rounded'
              onClick={handleSaveQr}
              label='Guardar QR'
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
