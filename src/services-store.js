import React, { useState } from 'react';
import TrainingsService from './services/trainings-service'

import Firebase from './services/firebase';
import Authentication from './services/authentication-service';
import ExercisesService from './services/exercises-service';
import UsersService from './services/users-service';
import SeriesService from './services/series-service';
import AuditService from './services/audit-service';

export const SelectionStateContext = React.createContext();

const ServicesStore = ({ children }) => {
    return (
        <Firebase>
            <Authentication>
                <AuditService>
                    <TrainingsService>
                        <ExercisesService>
                            <SeriesService>
                                <UsersService>
                                    {children}
                                </UsersService>
                            </SeriesService>
                        </ExercisesService>
                    </TrainingsService>
                </AuditService>
            </Authentication>
        </Firebase>
    );
};

export default ServicesStore;
