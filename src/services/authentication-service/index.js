import React, { useContext, useState, useEffect } from 'react';
import { FirebaseContext } from '../../services/firebase';

export const AuthUserContext = React.createContext();


const Authentication = ({children}) => {
    const firebaseService = useContext(FirebaseContext);
    const [state, setState] = useState(null); 

    useEffect(() => {
      if (firebaseService.firebase!=null) {
        firebaseService.firebase.auth.onAuthStateChanged(authUser => {
            setState(authUser)
        });
      }
    }, [firebaseService]);

    return (
        <AuthUserContext.Provider
          value={state}>
          {children}
        </AuthUserContext.Provider>
      );
}

export default Authentication;