import React, { useContext, useState, useEvent } from 'react';
import { withRouter } from 'react-router-dom'
import * as ROUTES from '../../constants/routes';
import { FirebaseContext } from '../../services/firebase';
import { SignUpLink } from '../sign-up-page';
import { PasswordForgetLink } from '../password-forget';


const SignInPage = () => (
    <div>
        <h1>SignIn</h1>
        <SignInForm />
        <PasswordForgetLink />
        <SignUpLink /> 
    </div>
);

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

const SignInFormBase = (props) => {
    const [state, setState] = useState(INITIAL_STATE)
    const firebase = useContext(FirebaseContext);
    const { email, password, error } = state;
    const isInvalid = password === '' || email === '';

    const onSubmit = event => {
        const { email, password } = state;
        
        firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                setState({ ...INITIAL_STATE });
                props.history.push(ROUTES.LANDING);
            })
            .catch(error => {
                setState({ error })
            });

        event.preventDefault();
    }

    const onChange = event => {
        let newState = {...state};
        newState[event.target.name] = event.target.value;
        setState(newState);
        event.preventDefault();
    }

    return (
        <form className="form-group" onSubmit={onSubmit} >
            <input
                className="form-control"
                name="email"
                value={email}
                onChange={onChange}
                type="text"
                placeholder="Email Address"
            />
            <input
                className="form-control"
                name="password"
                value={password}
                onChange={onChange}
                type="password"
                placeholder="Password"
            />
            <button
                className="btn btn-primary"
                disabled={isInvalid}
                type="submit">
                Sign In
                </button>

            {error && <p>{error.message}</p>}
        </form>
    )
}

const SignInForm = withRouter(SignInFormBase);


export default SignInPage;
export { SignInForm };