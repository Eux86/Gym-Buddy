import React, {useState, useEffect, useContext} from 'react'

import { FirebaseContext } from '../../services/firebase';
import { AuthUserContext } from '../authentication-service';

export const AuditServiceContext = React.createContext();


const AuditService = ({children}) => {
    const authUser = useContext(AuthUserContext);
    const firebaseContext = useContext(FirebaseContext);

    // Will return a timestamp that server side validations will use to allow or deny an operation
    const add = async (operation, data) => {
        const timestamp = new Date().getTime();
        await firebaseContext.firebase.db.ref(`audit/${authUser.uid}/${timestamp}`).set({
            operation: operation,
            data: data,
            timestamp
        })
        return timestamp;
    }

    return (
        <AuditServiceContext.Provider
          value={{
            add: add,
          }}
        >
          {children}
        </AuditServiceContext.Provider>
      );
}

export default AuditService;
