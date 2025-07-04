import { QrProps } from "./interface";
// import QRCode from "react-qr-code";
import { useRef, useState } from "preact/hooks";
import { Button } from "../button/button";

export const QrCode = ({ value, name, label, disabled, onChange }: QrProps) => {
    const [scannedValue, setScannedValue] = useState<string | null>(null);
    const [scanning, setScanning] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);

    const handleStartScan = async () => {
        if (!window.confirm('¿Deseas activar la cámara para escanear un código QR?')) {
            return;
        }
        setError(null);
        setScanning(true);
        setScannedValue(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            // BarcodeDetector API
            let barcodeDetector = null;
            try {
                barcodeDetector = window && (window as any).BarcodeDetector ? new (window as any).BarcodeDetector({ formats: ['qr_code'] }) : null;
            } catch (err) {
                barcodeDetector = null;
            }
            if (!barcodeDetector) {
                console.warn('BarcodeDetector no está disponible en este navegador:', window.navigator.userAgent);
                setError("Este navegador no soporta escaneo QR nativo. Intenta recargar la página, actualizar Chrome, Edge o Safari, o habilitar los flags experimentales de BarcodeDetector.");
                setScanning(false);
                stream.getTracks().forEach((track: any) => track.stop());
                return;
            }
            const detect = async () => {
                if (!videoRef.current) return;
                const canvas = document.createElement('canvas');
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const barcodes = await barcodeDetector.detect(imageData);
                if (barcodes.length > 0) {
                    const code = barcodes[0].rawValue;
                    setScannedValue(code);
                    setScanning(false);
                    stream.getTracks().forEach((track: any) => track.stop());
                    if (onChange) {
                        onChange({
                            target: {
                                name,
                                value: code,
                            },
                        } as any);
                    }
                    return;
                }
                if (scanning) {
                    requestAnimationFrame(detect);
                }
            };
            requestAnimationFrame(detect);
        } catch (e) {
            setError("No se pudo acceder a la cámara");
            setScanning(false);
        }
    };

    const handleStopScan = () => {
        setScanning(false);
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
        }
    };

    const qrToShow = scannedValue || value;

    return (
        <div className='w-full h-full flex flex-col items-center'>
            {label && <label className="mb-2 font-medium">{label}</label>}
            {onChange && (
                <Button
                    name="btn-response-qr"
                    type="button"
                    className="mb-2 px-3 py-1 bg-primary text-white rounded disabled:opacity-50"
                    onClick={handleStartScan}
                    disabled={disabled || scanning}
                    label={scanning ? 'Escaneando...' : 'Escanear QR'}
                />
            )}
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            {scanning && (
                <div className="mb-2">
                    <video ref={videoRef} style={{ width: 220, height: 220, borderRadius: 8 }} />
                    <Button
                        name="btn-response-qr-cancel"
                        type="button"
                        className="mt-2 px-2 py-1 bg-gray-200 rounded"
                        onClick={handleStopScan}
                        label='Cancelar'
                    />
                </div>
            )}

            {qrToShow && (
                // <QRCode value={typeof qrToShow === 'string' ? qrToShow : JSON.stringify(qrToShow)} size={128} />
                <div className='animate-wave1 rounded-full h-4 w-4 border-b-2 border-primary'></div>
            )}
        </div>
    );
};