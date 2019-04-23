import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import SignOutButton from '../sign-out-button';
import { AuthUserContext } from '../../services/authentication-service';


const Header = (props) => {
    const authUser = useContext(AuthUserContext);

    return (
        <div className="header">
            <div className="collapse bg-dark" id="navbarHeader">
                <div className="container">
                    <div className="row">
                        <div>
                            <h4 className="text-white">About</h4>
                            <p className="text-muted">Coming soon...</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="navbar navbar-dark bg-dark box-shadow">
                <div className="container d-flex justify-content-between">
                    <button className="navbar-toggler" type="button" onClick={() => window.history.back()} >
                        <span className="glyphicon glyphicon-chevron-left"></span>
                    </button>
                    <Link to="/" className="navbar-brand d-flex align-items-center">
                        <strong>Gym Buddy</strong>
                    </Link>
                    {authUser && <SignOutButton /> }
                    {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button> */}
                </div>
            </div>
        </div>
    )
}

export default Header;