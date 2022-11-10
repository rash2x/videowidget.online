import React from 'react';
import {useState} from 'react';

export const ProgressContext = React.createContext({
  progress: false,
  setProgress: (v) => {}
});

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(false);

  return (
    <ProgressContext.Provider value={{ progress, setProgress }}>
      {children}
    </ProgressContext.Provider>
  )
};

