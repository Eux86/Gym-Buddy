import React, { Component } from 'react';
import * as ROUTES from './constants/routes';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route } from 'react-router-dom'
import './App.css';
import Authentication from './services/authentication-service';
import TrainingDetailsPage from './components/TrainingDetailsPage';
import TrainingsPage from './components/TrainingsPage';
import Header from './components/header';
import SignInPage from './components/SignInPage';


class App extends Component {
  render() {
    return (
      <Router>
        <Header />
        <div className="d-flex justify-content-center">
          <Route exact path={ROUTES.LANDING} render={(props) => <TrainingsPage {...props} />} />
          <Route exact path={ROUTES.TRAINING_DETAILS} render={(props) => <TrainingDetailsPage {...props} />} />
          <Route path={ROUTES.SIGN_IN} render={(props) => <SignInPage {...props} />} />
          {/* <Route path={ROUTES.TRAINING_DAY} render={(props) => <TrainingDay {...props} exerciseService={ExerciseDb} />} />
                    <Route path={ROUTES.EXERCISE_INFO} render={(props) => <ExerciseDetails {...props} exerciseService={ExerciseDb} exerciseSetService={ExerciseSetDb} />} />
                    <Route path={ROUTES.ACCOUNT} render={(props) => <AccountPage {...props} />} />
                    <Route path={ROUTES.ADMIN} render={(props) => <AdminPage {...props} />} />
                    <Route path={ROUTES.PASSWORD_FORGET} render={(props) => <PasswordForgetPage {...props} />} />
                    <Route path={ROUTES.SIGN_UP} render={(props) => <SignUpPage {...props} />} />
            */}
        </div>
      </Router>
    );
  }
}

export default App;
