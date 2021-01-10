import * as React from 'react';

export type NavVariant = 'solid' | 'transparent';

type Dispatch = React.Dispatch<React.SetStateAction<NavVariant>>;

const NavVariantStateContext = React.createContext<NavVariant | undefined>(undefined);
const NavVariantDispatchContext = React.createContext<Dispatch | undefined>(undefined);

const NavVariantProvider: React.FC = ({ children }) => {
  const [variant, setVariant] = React.useState<NavVariant>('solid');

  return (
    <NavVariantStateContext.Provider value={variant}>
      <NavVariantDispatchContext.Provider value={setVariant}>
        {children}
      </NavVariantDispatchContext.Provider>
    </NavVariantStateContext.Provider>
  );
};

function useNavVariantState(): NavVariant {
  const context = React.useContext(NavVariantStateContext);
  if (context === undefined) {
    throw new Error('useNavVariantState must be used within a NavVariantProvider');
  }
  return context;
}
function useNavVariantDispatch(): Dispatch {
  const context = React.useContext(NavVariantDispatchContext);
  if (context === undefined) {
    throw new Error('useNavVariantDispatch must be used within a NavVariantProvider');
  }
  return context;
}
export { NavVariantProvider, useNavVariantState, useNavVariantDispatch };
