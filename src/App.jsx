import { SessionProvider, useSession } from './state/SessionContext.jsx';
import WelcomeScreen from './screens/WelcomeScreen.jsx';
import OptionsScreen from './screens/OptionsScreen.jsx';
import CameraScreen from './screens/CameraScreen.jsx';
import FinalScreen from './screens/FinalScreen.jsx';

function ScreenRouter() {
  const { session } = useSession();

  switch (session.screen) {
    case 'options':
      return <OptionsScreen />;
    case 'camera':
      return <CameraScreen />;
    case 'final':
      return <FinalScreen />;
    case 'welcome':
    default:
      return <WelcomeScreen />;
  }
}

export default function App() {
  return (
    <SessionProvider>
      <ScreenRouter />
    </SessionProvider>
  );
}
