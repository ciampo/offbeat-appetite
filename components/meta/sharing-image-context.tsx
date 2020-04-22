import React, { useReducer, useContext, createContext } from 'react';

type Action = { type: 'changeImage'; details: { url?: string } };
type Dispatch = (action: Action) => void;
type State = { image?: string };

const SharingImageStateContext = createContext<State | undefined>(undefined);
const SharingImageDispatchContext = createContext<Dispatch | undefined>(undefined);

const sharingImageReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'changeImage': {
      return { image: action.details.url };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const SharingImageProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(sharingImageReducer, { image: undefined });

  return (
    <SharingImageStateContext.Provider value={state}>
      <SharingImageDispatchContext.Provider value={dispatch}>
        {children}
      </SharingImageDispatchContext.Provider>
    </SharingImageStateContext.Provider>
  );
};

function useSharingImageState(): State {
  const context = useContext(SharingImageStateContext);
  if (context === undefined) {
    throw new Error('useSharingImageState must be used within a SharingImageProvider');
  }
  return context;
}
function useSharingImageDispatch(): Dispatch {
  const context = useContext(SharingImageDispatchContext);
  if (context === undefined) {
    throw new Error('useSharingImageDispatch must be used within a SharingImageProvider');
  }
  return context;
}
export { SharingImageProvider, useSharingImageState, useSharingImageDispatch };
