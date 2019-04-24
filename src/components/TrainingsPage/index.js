import React, { useContext, useState, useEffect } from 'react';
import * as ROUTES from '../../constants/routes'
import { FirebaseContext } from '../../services/firebase';
import { withRouter } from 'react-router-dom'
import TrainingDay from './TrainingDay';
import ListControls from './list-controls';
import { TrainingsServiceContext } from '../../services/trainings-service';
import { AuthUserContext } from '../../services/authentication-service';
import { UserSelectionsServiceContext } from '../../services/user-selection-service';


const TrainingsPage = props => {
    const trainingsService = useContext(TrainingsServiceContext);
    const firebase = useContext(FirebaseContext);
    const authUser = useContext(AuthUserContext);
    const userSelectionService = useContext(UserSelectionsServiceContext);

    const onSelectTraining = (id) => {
        userSelectionService.setSelectedTraining(id);
        props.history.push(ROUTES.TRAINING_DETAILS);
    }

    return (
        <div className="trainings-list col-12 col-lg-9">
            <p className="text-muted text-center">
                Your training sets ...
            </p>
            {authUser &&
                <p>Auth User: {authUser.uid}</p>
            }
            {userSelectionService && userSelectionService.userSelections &&
                <p>Selected training: { userSelectionService.userSelections.trainingId } </p>
            }
            <ul>
                <List 
                    trainingsData={trainingsService.trainings} 
                    onDelete={trainingsService.del}
                    onSelectTraining={onSelectTraining}
                    {...props} 
                />
                <ListControls 
                    onAdd={trainingsService.add} 
                />
            </ul>

        </div>
    );
};

const List = ({trainingsData, onDelete, onSelectTraining}) => {
    
    return (trainingsData &&
            trainingsData.map(training =>
                <TrainingDay 
                    key={training.id} 
                    training={training}
                    onDelete={onDelete}
                    onClick={() => onSelectTraining(training.id)}
                >{training.name}</TrainingDay>
            )
    );
}



export default withRouter(TrainingsPage);