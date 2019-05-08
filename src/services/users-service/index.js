import React, {useState, useEffect, useContext} from 'react'

import { FirebaseContext } from '../../services/firebase';

export const UsersServiceContext = React.createContext();


const UsersService = ({children}) => {
    const firebaseContext = useContext(FirebaseContext);
    // const [users, setUsers] = useState(null);

    const get = (id) => {
        return firebaseContext.firebase.db.ref(`users/${id}`)
        .once('value', snapshot => {  
            const obj = snapshot.val();
            const user = obj && Object.keys(obj).map( key => ({...obj[key], id: key }) );
            return user;
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
          }}
        >
          {children}
        </UsersServiceContext.Provider>
      );
}

export default UsersService;
