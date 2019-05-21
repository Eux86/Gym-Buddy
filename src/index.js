import './DragDropTouch'
import 'bootstrap/dist/css/bootstrap.css';
import './fontawesome'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import ServicesStore from './services-store';

import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

ReactDOM.render(
    <>
        {/* <link rel="stylesheet" href="https://getbootstrap.com/docs/4.2.1/dist/css/bootstrap.min.css" /> */}
        <ServicesStore>
            <App />
        </ServicesStore>
    </>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
