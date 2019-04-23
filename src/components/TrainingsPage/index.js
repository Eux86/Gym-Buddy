import React, { useContext, useState, useEffect } from 'react';

import { FirebaseContext } from '../../services/firebase';
import { withRouter } from 'react-router-dom'
import TrainingDay from './TrainingDay';
import ListControls from './list-controls';
import { TrainingsServiceContext } from '../../services/trainings-service';
import { AuthUserContext } from '../../services/authentication-service';


const TrainingsPage = props => {
    const trainingsService = useContext(TrainingsServiceContext);
    const firebase = useContext(FirebaseContext);
    const authUser = useContext(AuthUserContext);

    
    return (
        <div className="trainings-list col-12 col-lg-9">
            <p className="text-muted text-center">
                Your training sets ...
            </p>
            {authUser &&
                <p>Auth User: {authUser.uid}</p>
            }
            <ul>
                <List 
                    trainingsData={trainingsService.trainings} 
                    onDelete={trainingsService.del} 
                    {...props} 
                />
                <ListControls 
                    onAdd={trainingsService.add} 
                />
            </ul>

        </div>
    );
};

const List = ({trainingsData, onDelete, history}) => {
    debugger;
    return (trainingsData &&
            trainingsData.map(training =>
                <TrainingDay 
                    key={training.id} 
                    training={training}
                    onDelete={onDelete}
                    history={history}
                >{training.name}</TrainingDay>
            )
    );
}



export default withRouter(TrainingsPage);