import React, { useContext, useState, useEffect } from 'react';
import * as ROUTES from '../../constants/routes'
import { withRouter } from 'react-router-dom'
import TrainingDay from './TrainingDay';
import ListControls from '../common/list-controls';
import { TrainingsServiceContext } from '../../services/trainings-service';
import { AuthUserContext } from '../../services/authentication-service';
import { UserSelectionsServiceContext } from '../../services/user-selection-service';
import OnlyIfLogged from '../../services/only-if-logged';


const TrainingsPage = props => {
    const trainingsService = useContext(TrainingsServiceContext);
    const authUser = useContext(AuthUserContext);
    const userSelectionService = useContext(UserSelectionsServiceContext);

    const onSelectTraining = (id) => {
        userSelectionService.setSelectedTraining(id);
        props.history.push(ROUTES.TRAINING_DETAILS);
    }

    return (
        <div className="container">
            <p className="text-muted text-center">
                Your training sets ...
            </p>
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

const List = (props) => {
    return (
        <OnlyIfLogged {...props}>
        {props.trainingsData &&
            props.trainingsData.map(training =>
                <TrainingDay
                key={training.id}
                training={training}
                onDelete={props.onDelete}
                onClick={() => props.onSelectTraining(training.id)}
            >{training.name}</TrainingDay>
            )
        }
        </OnlyIfLogged>
    );
}



export default withRouter(TrainingsPage);