import React, {useState, useEffect, useContext} from 'react'

import { FirebaseContext } from '../../services/firebase';

export const UsersServiceContext = React.createContext();


const UsersService = ({children}) => {
    const firebaseContext = useContext(FirebaseContext);
    // const [users, setUsers] = useState(null);

    // const get = () => {
    //     firebaseContext.firebase.db.ref(`users`)
    //     .orderByKey()
    //     .equalTo(authUser.uid)
    //     .on('value', snapshot => {  
    //         const obj = snapshot.val();
    //         if (obj) {
    //             var trainings = obj[Object.keys(obj)[0]];
    //             const trainingSets = Object.keys(trainings).map(key => ({ 
    //                 ...trainings[key], 
    //                 id: key 
    //             }));
    //             console.log(trainingSets);
    //             setUsers( trainingSets );
    //         }
    //     });
    // }

    const add = async ({uid, username, email}) => {
        if (uid && username && email) {
            const nowIso = (new Date()).toISOString();
            return firebaseContext.firebase.db.ref(`users/${uid}`).set({
                username: username,
                email: email,
                registerDate: nowIso, // UTC iso 8601 string
            })
        } else {
            debugger;
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
