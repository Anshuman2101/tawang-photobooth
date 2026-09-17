import { useEffect, useRef, useState } from 'react';
import ScreenShell from '../components/ScreenShell.jsx';
import Button from '../components/Button.jsx';
import { useSession } from '../state/SessionContext.jsx';
import { useCamera } from '../hooks/useCamera.js';
import { capturePhoto } from '../utils/capturePhoto.js';
import styles from './CameraScreen.module.css';

const COUNTDOWN_SECONDS = 3;

export default function CameraScreen() {
  const { session, addPhoto, removePhoto, goToScreen } = useSession();
  const { videoRef, status, error, start, stop } = useCamera();

  const [countdown, setCountdown] = useState(null); // null | 3 | 2 | 1
  const [captureError, setCaptureError] = useState(null);
  const countdownTimerRef = useRef(null);

  // Start the camera as soon as this screen mounts; always release it when
  // leaving (unmount, or the visitor finishes/aborts the session).
  useEffect(() => {
    start();
    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [start]);

  const isBusy = countdown !== null;
  const canCapture = status === 'ready' && !isBusy;

  function beginCountdownAndCapture() {
    if (!canCapture) return;
    setCaptureError(null);
    let remaining = COUNTDOWN_SECONDS;
    setCountdown(remaining);

    countdownTimerRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
        setCountdown(null);
        takePhoto();
      } else {
        setCountdown(remaining);
      }
    }, 1000);
  }

  function takePhoto() {
    let imageData;
    try {
      imageData = capturePhoto(videoRef.current, session.filter);
    } catch (err) {
      setCaptureError(err.message);
      return;
    }

    addPhoto({
      id: `photo-${Date.now()}-${session.photos.length}`,
      imageData,
      timestamp: Date.now()
    });

    if (session.photos.length + 1 >= session.photoCount) {
      stop();
      goToScreen('final');
    }
  }

  return (
    <ScreenShell className={styles.camera}>
      <div className={styles.viewport}>
        <video ref={videoRef} autoPlay playsInline muted className={styles.video} />

        {countdown !== null && (
          <div className={styles.countdownOverlay}>
            {/* key forces the ring animation to restart cleanly on every photo */}
            <div key={countdown} className={styles.ring}>
              <span>{countdown}</span>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className={styles.errorPanel}>
            <p>{error}</p>
            <Button variant="secondary" onClick={start}>
              Try again
            </Button>
          </div>
        )}
      </div>

      {captureError && <p className={styles.captureError}>{captureError}</p>}

      <p className={styles.progress}>
        {session.photos.length} of {session.photoCount ?? '–'} photos taken
      </p>

      <div className={styles.filmstrip}>
        {session.photos.map((photo, index) => (
          <div key={photo.id} className={styles.filmItem}>
            <img src={photo.imageData} alt={`Captured photo ${index + 1}`} />
            <button type="button" aria-label="Retake this photo" onClick={() => removePhoto(photo.id)}>
              &times;
            </button>
          </div>
        ))}
      </div>

      <Button variant="primary" sticky disabled={!canCapture} onClick={beginCountdownAndCapture}>
        Take Photo
      </Button>
    </ScreenShell>
  );
}
