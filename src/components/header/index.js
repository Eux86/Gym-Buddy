import './index.css';

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../sign-out-button';
import { AuthUserContext } from '../../services/authentication-service';
import { UsersServiceContext } from '../../services/users-service';


const Header = () => {
    const authUser = useContext(AuthUserContext);
    const userContext = useContext(UsersServiceContext);

    const username = userContext.user && userContext.user.username;

    const onBack = (event) => {
        window.history.back();
        event.preventDefault();
    }

    return (
        <div className="header container-fluid bg-dark box-shadow">
            <div className="row h-100">
                <div className="col-2 session-widget">
                    <span>
                        {authUser && <SignOutButton />}
                    </span>
                    <span className="mx-2">
                        {username}
                    </span>
                </div>
                <div className="col-8 mx-auto text-center">
                    <Link to="/">Gym Buddy</Link>
                </div>
                <div className="col-2">
                    <a className="float-right" onClick={(e) => onBack(e)} href="#">
                        <span className="glyphicon glyphicon-menu-up"></span>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Header;