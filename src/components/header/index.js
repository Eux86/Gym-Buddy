import './index.css';

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../sign-out-button';
import { AuthUserContext } from '../../services/authentication-service';


const Header = () => {
    const authUser = useContext(AuthUserContext);

    const onBack = (event) => {
        window.history.back();
        event.preventDefault();
    }

    return (
        <div className="header container-fluid bg-dark box-shadow">
            <div className="row h-100">
                <div className="col-4">
                    <a onClick={(e) => onBack(e)} href="#">
                        <span className="glyphicon glyphicon-chevron-left"></span>
                    </a>
                </div>
                <div className="col-4 mx-auto text-center">
                    <Link to="/">Gym Buddy</Link>
                </div>
                <div className="col-4">
                    <div className="float-right">
                        {authUser && <SignOutButton />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;