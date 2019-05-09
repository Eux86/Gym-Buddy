import React, {useState, useEffect, useContext} from 'react'

import { FirebaseContext } from '../../services/firebase';
import { AuthUserContext } from '../authentication-service';

export const UsersServiceContext = React.createContext();


const UsersService = ({children}) => {
    const authUser = useContext(AuthUserContext);
    const firebaseContext = useContext(FirebaseContext);
    const [user, setUser] = useState({});

    useEffect(() => {
      if (authUser && firebaseContext.firebase) {
        get();
      }
    }, [authUser, firebaseContext, user])

    const get = () => {
        return firebaseContext.firebase.db.ref(`users/${authUser.uid}`)
        .on('value', snapshot => {  
          const obj = snapshot.val();
          setUser(obj);
        });
    }

    const add = async ({uid, username, email}) => {
        if (uid && username && email) {
            const nowIso = (new Date()).toISOString();
            return firebaseContext.firebase.db.ref(`users/${uid}`).set({
                username: username,
                email: email,
                registerDate: nowIso, // UTC iso 8601 string
            })
        } else {
            console.error("Missing fields creating user!");
        }
    }

    return (
        <UsersServiceContext.Provider
          value={{
            add: add,
            user: user,
          }}
        >
          {children}
        </UsersServiceContext.Provider>
      );
}

export default UsersService;
