import React, { useContext, useState, useEffect } from 'react';
import { FirebaseContext } from '../../services/firebase';

export const AuthUserContext = React.createContext();


const Authentication = ({ children }) => {
  const firebaseService = useContext(FirebaseContext);
  const [state, setState] = useState(undefined);

  let listener = null;
  useEffect(() => {
    if (firebaseService.firebase != null) {
      
      listener = firebaseService.firebase.auth.onAuthStateChanged(authUser => {
        setState(authUser)
        console.log("UID: "+ (authUser && authUser.uid));
      });
    }

    return (() => {
      if (listener)
        listener() // unregisters
      }
    )
  }, [firebaseService]);

  return (
    <AuthUserContext.Provider
      value={state}>
      {children}
    </AuthUserContext.Provider>
  );
}

export default Authentication;