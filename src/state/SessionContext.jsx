import { createContext, useContext, useMemo, useReducer } from 'react';

const initialSession = {
  screen: 'welcome', // 'welcome' | 'options' | 'camera' | 'final'
  photoCount: null, // 2 | 3 | 4
  frame: null, // 'frame1' | 'frame2' | 'frame3' | 'frame4'
  filter: 'colour', // 'colour' | 'blackAndWhite'
  photos: [] // { id, imageData, timestamp }
};

function sessionReducer(state, action) {
  switch (action.type) {
    case 'GO_TO_SCREEN':
      return { ...state, screen: action.screen };
    case 'SET_PHOTO_COUNT':
      // changing the count invalidates the frame choice, since frame art differs per count
      return { ...state, photoCount: action.value, frame: null };
    case 'SET_FRAME':
      return { ...state, frame: action.value };
    case 'SET_FILTER':
      return { ...state, filter: action.value };
    case 'ADD_PHOTO':
      return { ...state, photos: [...state.photos, action.photo] };
    case 'REMOVE_PHOTO':
      return { ...state, photos: state.photos.filter((p) => p.id !== action.id) };
    case 'RESET_SESSION':
      return { ...initialSession };
    default:
      return state;
  }
}

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [session, dispatch] = useReducer(sessionReducer, initialSession);

  const actions = useMemo(
    () => ({
      goToScreen: (screen) => dispatch({ type: 'GO_TO_SCREEN', screen }),
      setPhotoCount: (value) => dispatch({ type: 'SET_PHOTO_COUNT', value }),
      setFrame: (value) => dispatch({ type: 'SET_FRAME', value }),
      setFilter: (value) => dispatch({ type: 'SET_FILTER', value }),
      addPhoto: (photo) => dispatch({ type: 'ADD_PHOTO', photo }),
      removePhoto: (id) => dispatch({ type: 'REMOVE_PHOTO', id }),
      resetSession: () => dispatch({ type: 'RESET_SESSION' })
    }),
    []
  );

  const value = useMemo(() => ({ session, ...actions }), [session, actions]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within a SessionProvider');
  return ctx;
}
