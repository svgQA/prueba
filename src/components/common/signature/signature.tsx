import { useRef, useEffect } from 'preact/hooks';
import { SignatureProps } from "./interface";

export const Signature = ({ name, onChange, value, label, disabled }: SignatureProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);
    const lastPoint = useRef<{ x: number; y: number } | null>(null);

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
        if (disabled) return;
        isDrawing.current = true;
        lastPoint.current = getPointer(e);
    };

    const handlePointerMove = (e: any) => {
        if (!isDrawing.current || disabled) return;
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
        if (disabled) return;
        isDrawing.current = false;
        lastPoint.current = null;
        const canvas = canvasRef.current;
        if (canvas && onChange) {
            const dataUrl = canvas.toDataURL('image/png');
            onChange({
                target: {
                    name,
                    value: dataUrl,
                },
            } as any);
        }
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
                />
                {disabled && (
                    <div className="absolute inset-0 bg-white bg-opacity-60 cursor-not-allowed z-10" />
                )}
            </div>
            <div className="flex gap-2 mt-1">
                <button
                    type="button"
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                    onClick={handleClear}
                    disabled={disabled}
                >
                    Limpiar
                </button>
            </div>
        </div>
    );
};