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
            <div className="col-2">
                    <div className="">
                        {authUser && <SignOutButton />}
                    </div>
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