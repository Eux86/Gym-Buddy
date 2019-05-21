import './index.css';

import React, { useContext } from 'react';
import { AuthUserContext } from '../../services/authentication-service';
import { UsersServiceContext } from '../../services/users-service';
import { withRouter } from 'react-router-dom'
import * as ROUTES from '../../constants/routes'
import { FirebaseContext } from '../../services/firebase';


const Header = ({ history }) => {
    const authUser = useContext(AuthUserContext);
    const userContext = useContext(UsersServiceContext);
    const firebase = useContext(FirebaseContext);

    const username = userContext.user && userContext.user.username;

    const onBack = (event) => {
        window.history.back();
        event.preventDefault();
    }

    const logOut = event => {
        firebase.doSignOut().
        then(() => {
            history.push(ROUTES.SIGN_IN);
        });

        event.preventDefault();
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <a className="navbar-brand" href="#" onClick={() => history.push('/')}>Gym Buddy</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li className="nav-item">
                        <a className="nav-link" href="#" onClick={logOut}>Sign Out</a>
                    </li>
                </ul>
                
            </div>
        </nav>
    )
}

export default withRouter(Header);