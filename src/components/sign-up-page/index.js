import React, { useState, useContext } from 'react';
import * as ROUTES from '../../constants/routes';
import { Link, withRouter } from 'react-router-dom';
import { FirebaseContext } from '../../services/firebase';
import { UsersServiceContext } from '../../services/users-service';

const SignUpPage = () => {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col">
                    <h1>Sign-Up</h1>
                    <SignUpForm />
                </div>
            </div>
        </div>
    );
}

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

const SignUpFormBase = (props) => {
    const [state, setState] = useState(INITIAL_STATE);
    const firebase = useContext(FirebaseContext);
    const usersService = useContext(UsersServiceContext);

    const onSubmit = event => {
        const { username, email, passwordOne } = state;

        firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                return usersService.add({
                    uid: authUser.user.uid,
                    username,
                    email
                });
            })
            .then(() => {
                setState({ ...INITIAL_STATE });
                props.history.push(ROUTES.LANDING);
            })
            .catch(error => {
                setState({ ...state, error });
            })
        event.preventDefault();
    }

    const onChange = event => {
        setState({ ...state, [event.target.name]: event.target.value });
    }

    const {
        username,
        email,
        passwordOne,
        passwordTwo,
        error,
    } = state;

    const isInvalid =
        passwordOne !== passwordTwo ||
        passwordOne === '' ||
        email === '' ||
        username === '';

    return (
        <form onSubmit={onSubmit} >
            <div className="form-group">
                <input
                    name="username"
                    value={username}
                    onChange={onChange}
                    type="text"
                    placeholder="Full Name"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <input
                    name="email"
                    value={email}
                    onChange={onChange}
                    type="text"
                    placeholder="Email Address"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <input
                    name="passwordOne"
                    value={passwordOne}
                    onChange={onChange}
                    type="password"
                    placeholder="Password"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={onChange}
                    type="password"
                    placeholder="Confirm Password"
                    className="form-control"
                />
            </div>
            <div className="form-group float-right">
                <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={isInvalid}
                >Sign Up</button>
            </div>
            {error && <p>{error.message}</p>}
        </form>
    )
}
const SignUpForm = withRouter(SignUpFormBase);

const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>SignUp</Link>
    </p>
);


export default SignUpPage;
export { SignUpForm, SignUpLink }