import { useCallback, useEffect, useRef, useState } from 'react';

// Wraps getUserMedia with:
//  - a readiness check that waits for real video frame dimensions (some
//    phone browsers resolve play() slightly before frames actually exist)
//  - a request-id guard so React StrictMode's dev-only double-invoke of
//    effects (start -> stop -> start) can never leave an orphaned camera
//    stream running or attach a stale stream to the video element
export function useCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const requestIdRef = useRef(0);
  const [status, setStatus] = useState('idle'); // idle | starting | ready | error
  const [error, setError] = useState(null);

  const stop = useCallback(() => {
    requestIdRef.current += 1; // invalidate any in-flight start()
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStatus('idle');
  }, []);

  const start = useCallback(async () => {
    if (streamRef.current) return; // already running, avoid multiple active streams

    const myRequestId = ++requestIdRef.current;
    setStatus('starting');
    setError(null);

    if (!window.isSecureContext) {
      setError('Camera access needs a secure connection (HTTPS or localhost).');
      setStatus('error');
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('This browser does not support camera access.');
      setStatus('error');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });

      if (myRequestId !== requestIdRef.current || !videoRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      await waitForVideoReady(videoRef.current);

      if (myRequestId !== requestIdRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        return;
      }

      setStatus('ready');
    } catch (err) {
      if (myRequestId !== requestIdRef.current) return; // stale, ignore
      setError(mapGetUserMediaError(err));
      setStatus('error');
    }
  }, []);

  useEffect(() => stop, [stop]); // always release the camera when unmounting

  return { videoRef, status, error, start, stop };
}

function waitForVideoReady(videoEl) {
  if (videoEl.videoWidth > 0 && videoEl.videoHeight > 0) return Promise.resolve();
  return new Promise((resolve) => {
    const check = () => {
      if (videoEl.videoWidth > 0 && videoEl.videoHeight > 0) {
        videoEl.removeEventListener('loadedmetadata', check);
        videoEl.removeEventListener('loadeddata', check);
        resolve();
      }
    };
    videoEl.addEventListener('loadedmetadata', check);
    videoEl.addEventListener('loadeddata', check);
    setTimeout(resolve, 2000); // safety net so we never block forever
  });
}

function mapGetUserMediaError(err) {
  if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
    return 'Camera permission was denied. Please allow camera access and try again.';
  }
  if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
    return 'No camera was found on this device.';
  }
  return 'Could not access the camera. Please try again.';
}
