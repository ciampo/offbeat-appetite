import React, { useState, useContext, createContext } from 'react';

export type NavVariant = 'solid' | 'transparent';

type Dispatch = React.Dispatch<React.SetStateAction<NavVariant>>;

const NavVariantStateContext = createContext<NavVariant | undefined>(undefined);
const NavVariantDispatchContext = createContext<Dispatch | undefined>(undefined);

const NavVariantProvider: React.FC = ({ children }) => {
  const [variant, setVariant] = useState<NavVariant>('solid');

  return (
    <NavVariantStateContext.Provider value={variant}>
      <NavVariantDispatchContext.Provider value={setVariant}>
        {children}
      </NavVariantDispatchContext.Provider>
    </NavVariantStateContext.Provider>
  );
};

function useNavVariantState(): NavVariant {
  const context = useContext(NavVariantStateContext);
  if (context === undefined) {
    throw new Error('useNavVariantState must be used within a NavVariantProvider');
  }
  return context;
}
function useNavVariantDispatch(): Dispatch {
  const context = useContext(NavVariantDispatchContext);
  if (context === undefined) {
    throw new Error('useNavVariantDispatch must be used within a NavVariantProvider');
  }
  return context;
}
export { NavVariantProvider, useNavVariantState, useNavVariantDispatch };
