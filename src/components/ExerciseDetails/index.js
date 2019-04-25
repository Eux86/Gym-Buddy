import React, { useContext, useState, useEffect } from 'react';

import { UserSelectionsServiceContext } from '../../services/user-selection-service';
import { ExercisesServiceContext } from '../../services/exercises-service';
import * as ROUTES from '../../constants/routes';

const ExerciseDetailsPage = (props) => {
    const userSelectionsService = useContext(UserSelectionsServiceContext);

    const exercisesService = useContext(ExercisesServiceContext);
    const currentExerciseId = userSelectionsService.userSelections.exerciseId;
    const currentExercise = exercisesService && exercisesService.exercises && exercisesService.exercises.find(x => x.id === currentExerciseId);


    let series = [];
    if (currentExercise && currentExercise.series) {
        series = Object.keys(currentExercise.series).map(key => ({
            ...currentExercise.series[key],
            id: key
        }));
    }


    return (currentExercise && 
        <div>
            selcted exercise: {currentExerciseId}
            <h1>{currentExercise.name}</h1>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Repetitions</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Unit</th>
                    </tr>
                </thead>
                <tbody>
                    {currentExercise &&
                        series.map(serie =>
                            <tr>
                                <th scope="row">{serie.order}</th>
                                <td>{serie.amount}</td>
                                <td>{serie.repetitions}</td>
                                <td>{serie.unit}</td>
                            </tr>
                        )}
                </tbody>
            </table>
        </div>
    );
};


export default ExerciseDetailsPage;