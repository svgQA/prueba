import { useRef, useState, useEffect } from 'preact/hooks';

const AudioPlayer = ({ src }: { src: string }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onLoadedMetadata = () => {
            setDuration(audio.duration);
            setIsLoading(false);
        };
        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onEnded = () => setIsPlaying(false);

        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('ended', onEnded);
        };
    }, [src]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
    };

    const handleProgressChange = (e: any) => {
        const audio = audioRef.current;
        if (!audio) return;
        const target = e.target as HTMLInputElement;
        const value = Number(target.value);
        audio.currentTime = value;
        setCurrentTime(value);
    };

    const formatTime = (time: number) => {
        const min = Math.floor(time / 60)
            .toString()
            .padStart(2, '0');
        const sec = Math.floor(time % 60)
            .toString()
            .padStart(2, '0');
        return `${min}:${sec}`;
    };

    // Mostrar solo la duración si no se ha reproducido nada
    const showOnlyDuration = !isPlaying && currentTime === 0;

    return (
        <div className="flex items-center gap-2 w-full max-w-xs select-none">
            <audio ref={audioRef} src={src} preload="auto" />
            <button
                onClick={togglePlay}
                disabled={isLoading}
                className={`ml-2 flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 dark:border-gray-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 ${isPlaying ? 'bg-blue-500 text-white shadow animate-pulse' : 'bg-white dark:bg-gray-800 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700'}`}
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
                {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><polygon points="6,4 20,12 6,20" /></svg>
                )}
            </button>
            <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleProgressChange}
                className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all duration-200 mx-1"
                disabled={isLoading}
                style={{ accentColor: '#3b82f6' }}
            />
            <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 w-14 text-center">
                {showOnlyDuration ? formatTime(duration) : `${formatTime(currentTime)} / ${formatTime(duration)}`}
            </span>
        </div>
    );
}

export default AudioPlayer;