import { useEffect, useRef, useState } from 'react';
import ScreenShell from '../components/ScreenShell.jsx';
import Button from '../components/Button.jsx';
import { useSession } from '../state/SessionContext.jsx';
import { composeFinalImage } from '../utils/composeFinalImage.js';
import { publicAsset } from '../utils/publicAsset.js';
import styles from './FinalScreen.module.css';

export default function FinalScreen() {
  const { session, resetSession, goToScreen } = useSession();
  const [photoUrl, setPhotoUrl] = useState(null);
  const [ejected, setEjected] = useState(false);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    composeFinalImage(session).then((canvas) => {
      if (cancelled) return;
      canvas.toBlob((blob) => {
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;
        setPhotoUrl(url);
        // double rAF so the browser paints the "tucked in" state first, then
        // animates to "ejected" -- driven via inline style, not a CSS class,
        // so there is no cascade/specificity rule that could ever block it.
        requestAnimationFrame(() => requestAnimationFrame(() => setEjected(true)));
      }, 'image/png');
    });

    return () => {
      cancelled = true;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDownload() {
    if (!photoUrl) return;
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = 'tawang-photobooth.png';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function handleRestart() {
    resetSession();
    goToScreen('welcome');
  }

  return (
    <ScreenShell className={styles.final}>
      <header className={styles.header}>
        <h2>Your photo is ready</h2>
      </header>

      <div className={styles.stage}>
        <img
          src={publicAsset('assets/camera/camera-print-screen.png')}
          alt=""
          className={styles.cameraGraphic}
        />
        <div
          className={styles.photoWrap}
          style={{
            opacity: ejected ? 1 : 0,
            transform: ejected ? 'translateY(38%) scale(1)' : 'translateY(-14%) scale(0.9)'
          }}
        >
          {photoUrl && <img src={photoUrl} alt="Your composed photo" />}
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="primary" onClick={handleDownload} disabled={!photoUrl}>
          Download
        </Button>
        <Button variant="secondary" onClick={handleRestart}>
          Start Over
        </Button>
      </div>
    </ScreenShell>
  );
}
