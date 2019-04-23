import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom'
import * as ROUTES from '../../constants/routes'
import { FirebaseContext } from '../../services/firebase';


const SignOutButton = ( {history} ) => {
    const firebase = useContext(FirebaseContext);

    const logOut = event => {
        firebase.doSignOut().
        then(() => {
            history.push(ROUTES.SIGN_IN);
        });

        event.preventDefault();
    }

    return (
        <a onClick={logOut} href="#">
            <span className="glyphicon glyphicon-log-out"></span>
        </a>
    );
};

export default withRouter(SignOutButton);