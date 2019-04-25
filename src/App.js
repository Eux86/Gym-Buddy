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
import ExerciseDetailsPage from './components/ExerciseDetails';


class App extends Component {
  render() {
    return (
      <Router>
        <Header />
        <div className="d-flex justify-content-center">
          <Route exact path={ROUTES.LANDING} render={(props) => <TrainingsPage {...props} />} />
          <Route exact path={ROUTES.TRAINING_DETAILS} render={(props) => <TrainingDetailsPage {...props} />} />
          <Route path={ROUTES.SIGN_IN} render={(props) => <SignInPage {...props} />} />
          <Route path={ROUTES.EXERCISE_DETAILS} render={(props) => <ExerciseDetailsPage {...props} />} />
        </div>
      </Router>
    );
  }
}

export default App;
