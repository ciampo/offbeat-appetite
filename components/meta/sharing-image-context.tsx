import * as React from 'react';

type Action = { type: 'changeImage'; details: { url?: string } };
type Dispatch = (action: Action) => void;
type State = { image?: string };

const SharingImageStateContext = React.createContext<State | undefined>(undefined);
const SharingImageDispatchContext = React.createContext<Dispatch | undefined>(undefined);

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
  const [state, dispatch] = React.useReducer(sharingImageReducer, { image: undefined });

  return (
    <SharingImageStateContext.Provider value={state}>
      <SharingImageDispatchContext.Provider value={dispatch}>
        {children}
      </SharingImageDispatchContext.Provider>
    </SharingImageStateContext.Provider>
  );
};

function useSharingImageState(): State {
  const context = React.useContext(SharingImageStateContext);
  if (context === undefined) {
    throw new Error('useSharingImageState must be used within a SharingImageProvider');
  }
  return context;
}
function useSharingImageDispatch(): Dispatch {
  const context = React.useContext(SharingImageDispatchContext);
  if (context === undefined) {
    throw new Error('useSharingImageDispatch must be used within a SharingImageProvider');
  }
  return context;
}
export { SharingImageProvider, useSharingImageState, useSharingImageDispatch };
