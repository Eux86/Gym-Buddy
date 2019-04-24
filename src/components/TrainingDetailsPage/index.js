import React, { useContext, useState, useEffect } from 'react';

import { FirebaseContext } from '../../services/firebase';
import { TrainingsServiceContext } from '../../services/trainings-service';
import { AuthUserContext } from '../../services/authentication-service';
import { UserSelectionsServiceContext } from '../../services/user-selection-service';
import { ExercisesServiceContext } from '../../services/exercises-service';

const TrainingDetailsPage = (props) => {

    const userSelectionsService = useContext(UserSelectionsServiceContext);
    const exercisesService = useContext(ExercisesServiceContext);

    const exercises = exercisesService && exercisesService.exercises;
    return (
        <div>
            Training details for training: {userSelectionsService.userSelections.trainingId}
            {exercises && 
                <ul>
                    {exercises.map(exercise => 
                        <li key={exercise.id}>
                            <div>Name: {exercise.name}</div>
                            <div>Description: {exercise.description}</div>
                        </li>
                    )}
                </ul>
            }
        </div>
    );
};


export default TrainingDetailsPage;