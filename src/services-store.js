import React, { useState } from 'react';
import TrainingsService from './services/trainings-service'

import Firebase from './services/firebase';
import Authentication from './services/authentication-service';

export const SelectionStateContext = React.createContext();

const ServicesStore = ({ children }) => {
    console.log('Called Data Store');

    return (
        <Firebase>
            <Authentication>
                <TrainingsService>
                    {children}
                </TrainingsService>
            </Authentication>
        </Firebase>
    );
};

export default ServicesStore;
