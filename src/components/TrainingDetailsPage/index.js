import React, { useContext, useState, useEffect } from 'react';

import { FirebaseContext } from '../../services/firebase';
import { TrainingsServiceContext } from '../../services/trainings-service';
import { AuthUserContext } from '../../services/authentication-service';

const TrainingDetailsPage = (props) => {

    const id = props.match.params.id;
    const trainingsService = useContext(TrainingsServiceContext);
    const firebase = useContext(FirebaseContext);
    const authUser = useContext(AuthUserContext);
    const [exercises, setExercises] = useState([]);
    
    useEffect(() => {
        if (authUser) {
            trainingsService.getExercisesByTrainingId(firebase, authUser.uid, id).then( data => {
                setExercises(data);
                console.log(data);
            });
        }
    }, [authUser]);

    return (
        <div>
            Training details for training: {id}
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