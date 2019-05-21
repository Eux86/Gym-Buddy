import React, { useEffect, useContext } from 'react';
import * as ROUTES from '../../../constants/routes'
import { AuthUserContext } from '../../../services/authentication-service';
import { FirebaseContext } from '../../../services/firebase';

const OnlyIfLogged = (props) => {
    const firebaseContext = useContext(FirebaseContext);
    const authUser = useContext(AuthUserContext);

    if (authUser===undefined) return null;
    if (authUser===null) {
        props.history.push(ROUTES.SIGN_IN);
        return null;
    }

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
    const childrenWithProps = React.Children.map(props.children, child =>
        React.cloneElement(child, { ...props })
    );
    // const childrenWithProps = props.children.map(x => React.cloneElement(x, { ...props }));


    return (
        childrenWithProps
    )
}

export default OnlyIfLogged
