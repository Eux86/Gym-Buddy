import React, { useContext, useState, useEffect } from 'react';
import * as ROUTES from '../../constants/routes'
import { FirebaseContext } from '../../services/firebase';
import { withRouter } from 'react-router-dom'
import TrainingDay from './TrainingDay';
import ListControls from '../common/list-controls';
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
                <ListControls onAdd={trainingsService.add}>
                    <ListElementEditor />
                </ListControls>
            </ul>

        </div>
    );
};

const ListElementEditor = (props) => {
    const onChange = (event) => {
        props.onChange(event.target.value);
    }

    return (
        <input
            name="newElementName"
            type="text"
            className="form-control"
            placeholder="New Training"
            value={props.value}
            onChange={onChange} />
    )
}

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