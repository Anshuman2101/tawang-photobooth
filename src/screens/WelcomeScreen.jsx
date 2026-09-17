import ScreenShell from '../components/ScreenShell.jsx';
import Button from '../components/Button.jsx';
import { useSession } from '../state/SessionContext.jsx';
import { publicAsset } from '../utils/publicAsset.js';
import styles from './WelcomeScreen.module.css';

export default function WelcomeScreen() {
  const { resetSession, goToScreen } = useSession();

  function handleEnter() {
    resetSession();
    goToScreen('options');
  }

  return (
    <ScreenShell className={styles.welcome}>
      <img
        src={publicAsset('assets/welcome/prayer-flags.png')}
        alt=""
        className={styles.flags}
      />

      <div className={styles.hero}>
        <img
          src={publicAsset('assets/welcome/tawang-door.png')}
          alt="Tawang monastery gate"
          className={styles.door}
        />
      </div>

      <div className={styles.copy}>
        <h1>Tawang Photobooth</h1>
        <p>Capture a memory from the Tawang &amp; Himalayan Buddhist culture exhibition.</p>
        <Button variant="primary" onClick={handleEnter}>
          Enter
        </Button>
      </div>

      <div className={styles.midgroundWrap}>
        <img
          src={publicAsset('assets/welcome/midground-mountains.png')}
          alt=""
          className={styles.midground}
        />
      </div>
    </ScreenShell>
  );
}
