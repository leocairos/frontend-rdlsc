import React, { createContext, useReducer } from 'react';

import { IDataSample } from '../../pages/MylimsSamples/MylimsSampleTypes';

// Tipando as Props do contexto
type PropsMylimsContext = {
  state: { samples: IDataSample[] };
  dispatch: React.Dispatch<React.SetStateAction<any>>;
};
const initialState = { samples: [{}] };
// Valor default do contexto
const DEFAULT_VALUE = {
  state: initialState,
  dispatch: () => {}, // função de inicialização
};

// criando nosso contexto MylimsContext
const MylimsContext = createContext<PropsMylimsContext>(DEFAULT_VALUE);

export const MylimsProvider: React.FC = ({ children }) => {
  const actions = {
    getSamples(state, action) {
      console.log(JSON.stringify(action));
      return {
        state,
      };
    },
  };

  const reducer = (state, action): any => {
    const fn = actions[action.type];
    return fn ? fn(state, action) : state;
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MylimsContext.Provider value={{ state, dispatch }}>
      {children}
    </MylimsContext.Provider>
  );
};

export default MylimsContext;
