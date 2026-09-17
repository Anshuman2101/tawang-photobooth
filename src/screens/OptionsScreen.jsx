import { useMemo } from 'react';
import ScreenShell from '../components/ScreenShell.jsx';
import Button from '../components/Button.jsx';
import { useSession } from '../state/SessionContext.jsx';
import { FRAME_STYLES, frameImagePath } from '../data/frames.js';
import styles from './OptionsScreen.module.css';

const PHOTO_COUNTS = [2, 3, 4];
const FILTERS = [
  { value: 'colour', label: 'Colour' },
  { value: 'blackAndWhite', label: 'Black & White' }
];

export default function OptionsScreen() {
  const { session, setPhotoCount, setFrame, setFilter, goToScreen } = useSession();

  const isReady = Boolean(session.photoCount && session.frame && session.filter);

  const frameOptions = useMemo(() => {
    if (!session.photoCount) return [];
    return FRAME_STYLES.map((style) => ({
      style,
      src: frameImagePath(style, session.photoCount)
    }));
  }, [session.photoCount]);

  return (
    <ScreenShell className={styles.options}>
      <header className={styles.header}>
        <h2>Set up your photo</h2>
      </header>

      <section className={styles.card}>
        <h3 className={styles.cardTitle}>1 · Number of photos</h3>
        <div className={styles.row}>
          {PHOTO_COUNTS.map((count) => (
            <button
              key={count}
              type="button"
              className={`${styles.pill} ${session.photoCount === count ? styles.selected : ''}`}
              onClick={() => setPhotoCount(count)}
            >
              {count}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.card}>
        <h3 className={styles.cardTitle}>2 · Frame style</h3>
        {frameOptions.length === 0 ? (
          <p className={styles.hint}>Pick a photo count first</p>
        ) : (
          <div className={styles.frameGrid}>
            {frameOptions.map(({ style, src }) => (
              <button
                key={style}
                type="button"
                className={`${styles.frameThumb} ${session.frame === style ? styles.selected : ''}`}
                onClick={() => setFrame(style)}
              >
                <img src={src} alt={`${style} preview`} />
              </button>
            ))}
          </div>
        )}
      </section>

      <section className={styles.card}>
        <h3 className={styles.cardTitle}>3 · Filter</h3>
        <div className={styles.row}>
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`${styles.pill} ${session.filter === value ? styles.selected : ''}`}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <Button variant="primary" sticky disabled={!isReady} onClick={() => goToScreen('camera')}>
        Continue
      </Button>
    </ScreenShell>
  );
}
