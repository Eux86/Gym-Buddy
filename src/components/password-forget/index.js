import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import { FirebaseContext } from '../../services/firebase';

const PasswordForgetPage = () => (
    <div>
        <h1>PasswordForget</h1>
        <PasswordForgetForm />
    </div>
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
        <form className="form-group" onSubmit={onSubmit}>
            <input
                className="form-control"
                name="email"
                value={state.email}
                onChange={onChange}
                type="text"
                placeholder="Email Address"
            />
            <button className="btn btn-primary" disabled={isInvalid} type="submit">
                Reset My Password
        </button>
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