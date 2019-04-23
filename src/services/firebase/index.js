import React, { useState, useEffect } from 'react';
import app from 'firebase/app';
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyDZ3fDGE8ZogElCU39VNYOdLgUjNbLehOw",
  authDomain: "gymbuddy-666.firebaseapp.com",
  databaseURL: "https://gymbuddy-666.firebaseio.com",
  projectId: "gymbuddy-666",
  storageBucket: "gymbuddy-666.appspot.com",
  messagingSenderId: "301306868157"
};

export const FirebaseContext = React.createContext();

const Firebase = ({children}) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    if (!firebase.apps.length) {
      app.initializeApp(config);
    }

    setState({
      ...state,
      auth: app.auth(),
      db: app.database()
    });
  }, [])


  const doCreateUserWithEmailAndPassword = (email, password) =>
    state.auth.createUserWithEmailAndPassword(email, password);

  const doSignInWithEmailAndPassword = (email, password) =>
    state.auth.signInWithEmailAndPassword(email, password);

  const doSignOut = () => state.auth.signOut();

  const doPasswordReset = email => state.auth.sendPasswordResetEmail(email);

  const doPasswordUpdate = password => state.auth.currentUser.updatePassword(password);


  // USER API
  const user = uid => state.db.ref(`users/${uid}`);
  const users = () => state.db.ref(`users`);

  return (
    <FirebaseContext.Provider
      value={{
        firebase: state,
        doCreateUserWithEmailAndPassword: doCreateUserWithEmailAndPassword,
        doSignInWithEmailAndPassword: doSignInWithEmailAndPassword,
        doSignOut: doSignOut,
        doPasswordReset: doPasswordReset,
        doPasswordUpdate: doPasswordUpdate,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export default Firebase;