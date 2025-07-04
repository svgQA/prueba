import { useRef, useEffect, useState } from 'preact/hooks';
import { SignatureProps } from "./interface";
import { handleFileSaveWrapper } from '../file/utils/utils';
import { Button } from '../button/button';
import { IPresignedRequest } from '@/types/file';
import ShowFiles from '@/components/common/file/show.file';
import { DateUtils } from '@/utils/utilities/dates';

export const Signature = ({ name, onChange, value, label, disabled, ...props }: SignatureProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);
    const lastPoint = useRef<{ x: number; y: number } | null>(null);
    const [locked, setLocked] = useState(false);
    const [resources, setResources] = useState<IPresignedRequest[]>(Array.isArray(value) ? value : []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (value && typeof value === 'string') {
            const img = new window.Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = value;
        }
        setLocked(false);
    }, [value]);

    const getPointer = (e: any) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    };

    const handlePointerDown = (e: any) => {
        if (disabled || locked) return;
        isDrawing.current = true;
        lastPoint.current = getPointer(e);
    };

    const handlePointerMove = (e: any) => {
        if (!isDrawing.current || disabled || locked) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#222';
        const newPoint = getPointer(e);
        if (lastPoint.current) {
            ctx.beginPath();
            ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
            ctx.lineTo(newPoint.x, newPoint.y);
            ctx.stroke();
        }
        lastPoint.current = newPoint;
    };

    const handlePointerUp = () => {
        if (disabled || locked) return;
        isDrawing.current = false;
        lastPoint.current = null;
    };

    const dataURLtoFile = (dataurl: string, filename: string) => {
        const arr = dataurl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'image/png';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    const getFile = () => {
        const canvas = canvasRef.current;
        if (canvas && onChange) {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/png');
            const file = dataURLtoFile(dataUrl, `${DateUtils.dateToBackend(new Date())}-signature.png`);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.putImageData(imageData, 0, 0);
            ctx.globalCompositeOperation = 'source-over';
            return file;
        }
    }

    const handleSave = async () => {
        const file = getFile();
        if (!file) return;

        await handleFileSaveWrapper(
            file,
            `${DateUtils.dateToBackend(new Date())}-signature.png`,
            'image/png',
            emitChange,
            'form'
        );
        setLocked(true);
    }

    const emitChange = (dataset: any, file: any) => {
        setResources(prev => [...prev, file]);
        const safeValue = Array.isArray(value) ? value : [];
        onChange?.({
            target: {
                name: name,
                type: 'file',
                dataset: dataset,
                value: [...safeValue, file],
            },
        });
    };

    const handleClear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (onChange) {
            onChange({
                target: {
                    name,
                    value: '',
                },
            } as any);
        }
    };

    const handleRemove = (uuid: string) => {
        setResources(prev => prev.filter((file) => file.uuid !== uuid));
    };

    return (
        <div className="flex flex-col gap-2 items-start w-full h-full">
            {label && <label className="mb-1 font-medium">{label}</label>}
            <div className="relative border rounded bg-white" style={{ width: 350, height: 150 }}>
                <canvas
                    ref={canvasRef}
                    width={350}
                    height={150}
                    className="block cursor-crosshair rounded"
                    style={{ touchAction: 'none', background: '#fff' }}
                    onMouseDown={handlePointerDown}
                    onMouseMove={handlePointerMove}
                    onMouseUp={handlePointerUp}
                    onMouseLeave={handlePointerUp}
                    onTouchStart={handlePointerDown}
                    onTouchMove={handlePointerMove}
                    onTouchEnd={handlePointerUp}
                    {...props}
                />
                {(disabled || locked || resources.length > 0) && (
                    <div className="absolute inset-0 bg-white bg-opacity-60 cursor-not-allowed z-10" />
                )}
            </div>
            <div className="flex gap-2 mt-1">
                <Button
                    name="btn-clear-signature"
                    type="button"
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                    onClick={handleSave}
                    disabled={locked || resources.length > 0}
                    label='guardar'
                />
                <Button
                    name="btn-clear-signature"
                    type="button"
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                    onClick={handleClear}
                    disabled={disabled || locked || resources.length > 0}
                    label='Limpiar'
                />
            </div>
            {resources.length > 0 && <ShowFiles resources={resources} removeFile={handleRemove} />}
        </div>
    );
};