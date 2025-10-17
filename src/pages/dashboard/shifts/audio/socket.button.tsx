import { useEffect, useRef, useState } from 'preact/hooks';
import { io, Socket } from 'socket.io-client';
import { IJanusSettings, IParticipant } from './interfaces';
import { Button } from '@/components/common/button/button';
import { useSignal } from '@preact/signals';
import { useTranslation } from 'react-i18next';

const myName = `User_${Math.floor(Math.random() * 1000)}`;
let pendingOfferMap = new Map();

export interface AudioButtonProps {
  onClose?: () => void;
}

export const AudioButton = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const isOpen = useSignal<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [room, setRoom] = useState<string | null>(null);
  const [participants, setParticipants] = useState<IParticipant[]>([]);

  const socketRef = useRef<Socket>(null);
  const peerConnectionRef = useRef<RTCPeerConnection>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_JANUS_SERVICE_URL, {
      rejectUnauthorized: false,
      autoConnect: false,
      reconnection: false,
    });

    setupSocketListeners();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      removeAllAudioElements();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        isOpen.value = false;
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref]);

  const removeAllAudioElements = () => {
    setParticipants([]);
    setAudioStream(null);
  };

  const removeAudioElement = (feed: string) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p.feed !== feed)
    );
  };

  const setupSocketListeners = () => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on('connect', () => {
      socket.sendBuffer = [];
      setConnected(true);
      join();
    });

    socket.on('disconnect', () => {
      setConnected(false);

      setRoom(null);
      setParticipants([]);

      pendingOfferMap.clear();
      removeAllAudioElements();
      closePC();
    });

    socket.on('audiobridge-error', ({ error, _id }) => {
      if (error === 'backend-failure' || error === 'session-not-available') {
        socket.disconnect();
        return;
      }
      if (pendingOfferMap.has(_id)) {
        pendingOfferMap.delete(_id);
        removeAllAudioElements();
        closePC();
        return;
      }
    });

    socket.on('joined', async ({ data }) => {
      closePC();
      setRoom(data.room);
      setParticipants(data.participants);

      try {
        const offer = await doOffer(/* data.feed */);
        configure({ jsep: offer });
      } catch (error) {
        closePC();
        return;
      }
    });

    socket.on('peer-joined', ({ data }) => {
      setParticipants((prev) => [...prev, data]);
    });

    socket.on('peer-leaving', ({ data }) => {
      removeAudioElement(data.feed);
      // setParticipants((prev) => prev.filter((p) => p.feed !== data.feed));
    });

    socket.on('configured', ({ data, _id }) => {
      pendingOfferMap.delete(_id);
      if (peerConnectionRef.current && data.jsep) {
        peerConnectionRef.current
          .setRemoteDescription(data.jsep)
          .then(() => {
            /*console.log('remote sdp OK')*/
          })
          .catch(() => {
            /*console.log('error setting remote sdp', e)*/
          });
      }
    });
  };

  const join = () => {
    const joinData = { room: 1234, display: myName };
    socketRef?.current?.emit('join', {
      data: joinData,
      _id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
    });
  };

  function getId() {
    return Math.floor(Number.MAX_SAFE_INTEGER * Math.random());
  }

  const configure = (model: IJanusSettings) => {
    const configureId = getId();

    // if (model.jsep) {
    //   // configureData.jsep = jsep;
    //   // pendingOfferMap.set(configureId, null);
    // }

    socketRef.current?.emit('configure', {
      data: model,
      _id: configureId,
    });
  };

  const doOffer = async (/* feed: any */) => {
    if (!peerConnectionRef.current) {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      peerConnectionRef.current = pc;

      // pc.onnegotiationneeded = (event) =>
      //   console.log('pc.onnegotiationneeded', event);

      pc.onicecandidate = ({ candidate }) => {
        const trickleData = candidate ? { candidate } : {};
        const trickleEvent = candidate ? 'trickle' : 'trickle-complete';
        socketRef?.current?.emit(trickleEvent, {
          data: trickleData,
          _id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        });
      };

      pc.oniceconnectionstatechange = () => {
        if (
          pc.iceConnectionState === 'failed' ||
          pc.iceConnectionState === 'closed'
        ) {
          closePC();
        }
      };

      pc.ontrack = (event) => {
        const remoteStream = event.streams[0];
        if (!remoteStream) return;
        setAudioStream(remoteStream);
      };

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });
    } else {
      peerConnectionRef.current.restartIce();
    }

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    return offer;
  };

  const closePC = () => {
    const pc = peerConnectionRef.current;
    if (!pc) return;
    pc.getSenders().forEach((sender) => {
      if (sender.track) sender.track.stop();
    });
    pc.getReceivers().forEach((receiver) => {
      if (receiver.track) receiver.track.stop();
    });
    pc.onnegotiationneeded = null;
    pc.onicecandidate = null;
    pc.oniceconnectionstatechange = null;
    pc.ontrack = null;
    pc.close();
    if (pc === peerConnectionRef.current) peerConnectionRef.current = null;
  };

  const handleToggleConnection = () => {
    isOpen.value = !isOpen.value;
    if (connected) {
      socketRef?.current?.disconnect();
    } else {
      socketRef?.current?.connect();
    }
  };

  return (
    <div className='flex flex-row items-center gap-2 ml-2 relative'>
      <Button
        name='audio-button'
        onClick={handleToggleConnection}
        selected={connected}
        className='border-2 bg-gray-100 hover:bg-gray-300'
        icon='114'
        iconSize='sm'
      />
      <div
        className={`absolute top-12 left-0 min-w-[300px] h-fit flex flex-col justify-between bg-b-light-light dark:bg-b-dark-dark rounded-lg p-4 z-10 border border-b-light-dark dark:border-b-dark-light ${isOpen.value ? 'block' : 'hidden'}`}
        ref={ref}
      >
        <div className='flex flex-col justify-between'>
          <h2>
            {t('h_room')}: {room || t('h_not_connected')}
          </h2>
          <h3>
            {t('h_participants')}: {audioStream ? t('yes') : t('no')}
          </h3>
        </div>
        {audioStream && (
          <audio
            autoPlay
            controls
            ref={(el) => {
              if (el) {
                el.srcObject = audioStream;
              }
            }}
          />
        )}
        <ul>
          {participants.map((participant) => (
            <li key={participant.feed}>
              {participant.display} ({t('h_feed')}: {participant.feed}){' '}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
