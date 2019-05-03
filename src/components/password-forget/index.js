import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import { FirebaseContext } from '../../services/firebase';

const PasswordForgetPage = () => (
    <div className="container">
        <div className="row justify-content-center">
            <div className="col">
                <h1>Recover Password</h1>
                <PasswordForgetForm />
            </div>
        </div>
    </div >
);

const INITIAL_STATE = {
    email: '',
    error: null,
};

const PasswordForgetForm = (props) => {
    const [state, setState] = useState(INITIAL_STATE);
    const firebaseContext = useContext(FirebaseContext);

    const onSubmit = event => {

        const { email } = state;

        firebaseContext
            .doPasswordReset(email)
            .then(() => {
                setState({ ...INITIAL_STATE });
            })
            .catch(error => {
                setState({ ...state, error });
            });

        event.preventDefault();
    };

    const onChange = event => {
        setState({ ...state, [event.target.name]: event.target.value });
    };

    const { email, error } = state;

    const isInvalid = email === '';

    return (
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <input
                    className="form-control"
                    name="email"
                    value={state.email}
                    onChange={onChange}
                    type="text"
                    placeholder="Email Address"
                />
            </div>
            <div className="form-group float-right">
                <button className="btn btn-primary" disabled={isInvalid} type="submit">
                    Reset My Password
                </button>
            </div>
            {error && <p>{error.message}</p>}
        </form>
    );
}

const PasswordForgetLink = () => (
    <p>
        <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
    </p>
);

export default PasswordForgetPage;

export { PasswordForgetForm, PasswordForgetLink };