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
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <a class="navbar-brand" href="#" onClick={() => history.push('/')}>Gym Buddy</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
                <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" href="#" onClick={logOut}>Sign Out</a>
                    </li>
                </ul>
                
            </div>
        </nav>

        // <div className="header container-fluid bg-dark box-shadow">
        //     <div className="row h-100">
        //         <div className="col-2">
        //             {/* <a className="" onClick={(e) => onBack(e)} href="#">
        //                 <span className="glyphicon glyphicon-menu-up"></span>
        //             </a> */}
        //         </div>
        //         <div className="header-title col-8 mx-auto text-center">
        //             <Link to="/">Gym Buddy</Link>
        //         </div>
        //         <div className="col-2 session-widget">
        //             <div className="float-right">
        //                 <UserCircle history={history} />
        //             </div>
        //             {/* <span className="float-right">
        //                 {authUser && <SignOutButton />}
        //             </span> */}
        //         </div>
        //     </div>
        // </div>
    )
}

export default withRouter(Header);