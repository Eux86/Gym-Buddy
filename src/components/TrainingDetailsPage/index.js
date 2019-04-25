import React, { useContext, useState, useEffect } from 'react';

import { FirebaseContext } from '../../services/firebase';
import { AuthUserContext } from '../../services/authentication-service';
import { UserSelectionsServiceContext } from '../../services/user-selection-service';
import { ExercisesServiceContext } from '../../services/exercises-service';
import * as ROUTES from '../../constants/routes';

const TrainingDetailsPage = (props) => {

    const userSelectionsService = useContext(UserSelectionsServiceContext);
    const exercisesService = useContext(ExercisesServiceContext);

    const exercises = exercisesService && exercisesService.exercises;

    const deleteExercise = (event, id) => {
        console.log("should delete exercise id: " + id);
        event.preventDefault();
    }

    const onClick = (event, id) => {
        console.log("should slect exercise id: " + id);
        userSelectionsService.setSelectedExercise(id);
        props.history.push(ROUTES.EXERCISE_DETAILS);
        event.preventDefault();
    }

    return (
        <div>
            Training details for training: {userSelectionsService.userSelections.trainingId}
            {exercises &&
                <ul>
                    {exercises.map(exercise =>
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
                    )}
                </ul>
            }
        </div>
    );
};


export default TrainingDetailsPage;