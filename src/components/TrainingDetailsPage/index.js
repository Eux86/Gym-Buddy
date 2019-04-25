import React, { useContext, useState, useEffect } from 'react';

import { FirebaseContext } from '../../services/firebase';
import { AuthUserContext } from '../../services/authentication-service';
import { UserSelectionsServiceContext } from '../../services/user-selection-service';
import { ExercisesServiceContext } from '../../services/exercises-service';
import * as ROUTES from '../../constants/routes';
import { TrainingsServiceContext } from '../../services/trainings-service';
import ListControls from '../common/list-controls';

const TrainingDetailsPage = (props) => {

    const userSelectionsService = useContext(UserSelectionsServiceContext);
    const exercisesService = useContext(ExercisesServiceContext);
    const trainingService = useContext(TrainingsServiceContext);
    const exercises = exercisesService && exercisesService.exercises;
    let currentTraining = null;

    if (userSelectionsService.userSelections.trainingId && trainingService.trainings) {
        currentTraining = trainingService.trainings.find(x => x.id === userSelectionsService.userSelections.trainingId);
    }

    const deleteExercise = (event, id) => {
        exercisesService.del(currentTraining.id, id);
        event.preventDefault();
    }

    const onClick = (event, id) => {
        console.log("should slect exercise id: " + id);
        userSelectionsService.setSelectedExercise(id);
        props.history.push(ROUTES.EXERCISE_DETAILS);
        event.preventDefault();
    }

    const onAdd = (newElementName) => {
        console.log("should add " + newElementName);
        const newExercise = {
            name: newElementName,
            description: ''
        }
        exercisesService.add(currentTraining.id, newExercise);
    }

    return (
        <div>
            Training details for training: {userSelectionsService.userSelections.trainingId}
            <h1>{currentTraining && currentTraining.name}</h1>
            {exercises &&
                <ul>
                    <List exercises={exercises} onClick={onClick} deleteExercise={deleteExercise} />
                    <ListControls onAdd={onAdd}>
                        <ListElementEditor />
                    </ListControls>
                </ul>
            }
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
            placeholder="New Exercise"
            value={props.value}
            onChange={onChange} />
    )
}



const List = ({ exercises, onClick, deleteExercise }) => {
    return (
        exercises.map(exercise =>
            <li key={exercise.id} className="list-group-item d-flex justify-content-between">
                <div>
                    <a href="#" onClick={(event) => onClick(event, exercise.id)}>
                        <div>
                            {exercise.name}
                        </div>
                    </a>
                    <div className="text-muted">
                        {exercise.description}
                    </div>
                </div>
                <div className="mx-2">
                    <button type="button" className="btn btn-default btn-md" onClick={(event) => deleteExercise(event, exercise.id)}>
                        <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                    </button>
                </div>
            </li>
        )
    )
}

export default TrainingDetailsPage;