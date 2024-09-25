import { useEffect, useRef, useState } from 'preact/hooks';
import { io, Socket } from 'socket.io-client';

// const RTCPeerConnection = (
//   window.RTCPeerConnection ||
//   window.webkitRTCPeerConnection ||
//   window.mozRTCPeerConnection
// ).bind(window);

const myName = `User_${Math.floor(Math.random() * 1000)}`;
let pendingOfferMap = new Map();

export const AudioButton = () => {
  const [connected, setConnected] = useState<boolean>(false);
  const [room, setRoom] = useState<string | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);

  const socketRef = useRef<Socket>(null);
  const peerConnectionRef = useRef<RTCPeerConnection>(null);

  useEffect(() => {
    socketRef.current = io('https://192.168.1.142/socket', {
      rejectUnauthorized: false,
      autoConnect: false,
      reconnection: false,
    });

    setupSocketListeners();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const setupSocketListeners = () => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on('connect', () => {
      console.log('socket connected');
      socket.sendBuffer = [];
      setConnected(true);
      join();
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected');

      setConnected(false);

      setRoom(null);
      setParticipants([]);

      pendingOfferMap.clear();
      removeAllAudioElements();
      closePC();
    });

    socket.on('audiobridge-error', ({ error, _id }) => {
      console.log('audiobridge error', error);
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
      console.log('you have joined to room', data);
      removeAllAudioElements();
      closePC();
      setRoom(data.room);
      setParticipants(data.participants);
      setAudioElement(null, data.feed, data.display, data.room);

      try {
        const offer = await doOffer(data.feed);
        configure({ jsep: offer });
      } catch (error) {
        console.log('error during audiobridge setup/offer', error);
        removeAllAudioElements();
        closePC();
        return;
      }

      // @ts-ignore
      data.participants.forEach(({ feed, display }) =>
        setAudioElement(null, feed, display)
      );
    });

    socket.on('peer-joined', ({ data }) => {
      console.log('peer joined to room', data);
      setParticipants((prev) => [...prev, data]);
    });

    socket.on('peer-leaving', ({ data }) => {
      removeAudioElement(data.feed);
      // console.log('peer feed leaving', data);
      // setParticipants((prev) => prev.filter((p) => p.feed !== data.feed));
    });

    socket.on('configured', ({ data, _id }) => {
      console.log('feed configured', data);
      if (data.feed && data.display) {
        setAudioElement(null, data.feed, data.display);
      }
      pendingOfferMap.delete(_id);
      if (peerConnectionRef.current && data.jsep) {
        peerConnectionRef.current
          .setRemoteDescription(data.jsep)
          .then(() => console.log('remote sdp OK'))
          .catch((e) => console.log('error setting remote sdp', e));
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

  const configure = ({
    display,
    muted,
    record,
    filename,
    bitrate,
    expected_loss,
    group,
    jsep,
  }: any) => {
    const configureData: any = {};
    const configureId = getId();

    if (display) configureData.display = display;
    if (typeof muted === 'boolean') configureData.muted = muted;
    if (typeof record === 'boolean') configureData.record = record;
    if (filename) configureData.filename = filename;
    if (typeof bitrate === 'number') configureData.bitrate = bitrate;
    if (typeof expected_loss === 'number')
      configureData.expected_loss = expected_loss;
    if (group) configureData.group = group;
    if (jsep) {
      configureData.jsep = jsep;
      pendingOfferMap.set(configureId, null);
    }

    socketRef?.current?.emit('configure', {
      data: configureData,
      _id: configureId,
    });
  };

  // @ts-ignore
  const doOffer = async (feed: any) => {
    if (!peerConnectionRef.current) {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      peerConnectionRef.current = pc;

      pc.onnegotiationneeded = (event) =>
        console.log('pc.onnegotiationneeded', event);

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
        console.log('pc.ontrack', event);

        event.track.onunmute = (evt) => {
          console.log('track.onunmute', evt);
        };
        event.track.onmute = (evt) => {
          console.log('track.onmute', evt);
        };
        event.track.onended = (evt) => {
          console.log('track.onended', evt);
        };

        const remoteStream = event.streams[0];
        setAudioElement(remoteStream, feed, myName);
      };

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      console.log('getUserMedia OK');

      stream.getTracks().forEach((track) => {
        console.log('adding track', track);
        pc.addTrack(track, stream);
      });
    } else {
      console.log('Performing ICE restart');
      peerConnectionRef.current.restartIce();
    }

    const offer = await peerConnectionRef.current.createOffer();
    console.log('create offer OK');
    await peerConnectionRef.current.setLocalDescription(offer);
    console.log('set local sdp OK');
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
    if (connected) {
      socketRef?.current?.disconnect();
    } else {
      socketRef?.current?.connect();
    }
  };

  function setAudioElement(stream: any, feed: any, display: any, room?: any) {
    if (room) {
      // @ts-ignore
      document
        .getElementById('audios')
        .getElementsByTagName('span')[0].innerHTML =
        '   --- AUDIOBRIDGE (' + room + ') ---  ';
    }
    if (!feed) return;
    let audioContainerExists = document.getElementById('audio_' + feed) != null;

    let audioContainer;
    if (!audioContainerExists) {
      audioContainer = document.createElement('div');
      audioContainer.id = 'audio_' + feed;
      audioContainer.appendChild(document.createElement('br'));

      const nameElem = document.createElement('span');
      nameElem.style.display = 'table';
      audioContainer.appendChild(nameElem);
      // @ts-ignore
      document.getElementById('participants').appendChild(audioContainer);
    } else {
      audioContainer = document.getElementById('audio_' + feed);
    }

    if (stream) {
      const audioStreamElemExists =
        // @ts-ignore
        typeof audioContainer.getElementsByTagName('audio')[0] !== 'undefined';
      const audioStreamElem = audioStreamElemExists
        ? // @ts-ignore
          audioContainer.getElementsByTagName('audio')[0]
        : document.createElement('audio');
      // @ts-ignore
      if (!audioStreamElemExists) audioContainer.appendChild(audioStreamElem);
      audioStreamElem.autoplay = true;
      audioStreamElem.srcObject = stream;
    }

    if (display) {
      // @ts-ignore
      audioContainer.getElementsByTagName('span')[0].innerHTML =
        ' --- ' + display + ' (' + feed + ')';
    }
  }

  function removeAudioElement(feed: any) {
    if (!feed) return;
    const audioContainer = document.getElementById('audio_' + feed);
    if (audioContainer) {
      const audioStreamElem = audioContainer.getElementsByTagName('audio')[0];
      if (audioStreamElem) {
        audioStreamElem.srcObject = null;
      }
      audioContainer.remove();
    }
  }

  function removeAllAudioElements() {
    const participants = document.getElementById('participants');
    // @ts-ignore
    let audioContainers = participants.getElementsByTagName('div');
    for (let i = 0; i < audioContainers.length; i++) {
      const audioContainer = audioContainers[i];
      const audioStreamElem = audioContainer.getElementsByTagName('audio')[0];
      if (audioStreamElem && audioStreamElem.srcObject) {
        audioStreamElem.srcObject
          // @ts-ignore
          .getTracks()
          // @ts-ignore
          .forEach((track) => track.stop());
        audioStreamElem.srcObject = null;
      }
      audioContainer.remove();
    }
    // @ts-ignore
    while (participants.firstChild) {
      // @ts-ignore
      participants.removeChild(participants.firstChild);
    }
    // @ts-ignore
    document
      .getElementById('audios')
      .getElementsByTagName('span')[0].innerHTML =
      '   --- AUDIOBRIDGE () ---  ';
  }

  return (
    <div>
      <button
        onClick={handleToggleConnection}
        className='border-2 bg-gray-100 hover:bg-gray-300'
      >
        {connected ? 'Disconnect' : 'Connect'}
      </button>
      <div id='audios'>
        <span style='font-size: 32px;'> --- AUDIOBRIDGE () --- </span>
        <br />
        <br />
        <div id='participants'></div>
      </div>
      <div>
        <h2>AudioBridge Room: {room || 'Not connected'}</h2>
        <h3>Participants:</h3>
        <ul>
          {participants.map((p: any) => (
            <li key={p.feed}>
              {p.display} (Feed: {p.feed})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
