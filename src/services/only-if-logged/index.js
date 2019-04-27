import React, { useEffect, useContext } from 'react';
import * as ROUTES from '../../constants/routes'
import { AuthUserContext } from '../authentication-service';
import { FirebaseContext } from '../firebase';

const OnlyIfLogged = (props) => {
    const firebaseContext = useContext(FirebaseContext);
    const authUser = useContext(AuthUserContext);

    let listener = null;
    useEffect(() => {
        if (firebaseContext.firebase) {
            listener = firebaseContext.firebase.auth.onAuthStateChanged(
                authUser => {
                    if (!authUser) {
                        props.history.push(ROUTES.SIGN_IN);
                    }
                }
            )

            return (() => {
                if (listener)
                    listener() // unregisters
                } 
            )
        }
    }, [firebaseContext])


    if (!props.children) {
        return null;
    }
    const childrenWithProps = props.children.map(x => React.cloneElement(x, { ...props }));


    return (
        <>
            {authUser &&
                childrenWithProps
            }
        </>
    )
}

export default OnlyIfLogged
