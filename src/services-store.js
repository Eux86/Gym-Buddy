import React, { useState } from 'react';
import TrainingsService from './services/trainings-service'

import Firebase from './services/firebase';
import Authentication from './services/authentication-service';
import UserSelectionsService from './services/user-selection-service';
import ExercisesService from './services/exercises-service';

export const SelectionStateContext = React.createContext();

const ServicesStore = ({ children }) => {
    return (
        <Firebase>
            <Authentication>
                <TrainingsService>
                    <UserSelectionsService>
                        <ExercisesService>
                            {children}
                        </ExercisesService>
                    </UserSelectionsService>
                </TrainingsService>
            </Authentication>
        </Firebase>
    );
};

export default ServicesStore;
