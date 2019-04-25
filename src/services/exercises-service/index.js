import React, {useState, useEffect, useContext} from 'react'

import { FirebaseContext } from '../../services/firebase';
import { AuthUserContext } from '../authentication-service';
import { UserSelectionsServiceContext } from '../user-selection-service';

export const ExercisesServiceContext = React.createContext();


const ExercisesService = ({children}) => {
    const authUser = useContext(AuthUserContext);
    const firebaseContext = useContext(FirebaseContext);
    const userSelectionsService = useContext(UserSelectionsServiceContext);
    const [exercises, setExercises] = useState(null);

    
    useEffect(() => {
        if (authUser && firebaseContext.firebase && userSelectionsService.userSelections.trainingId) {
            const trainingId = userSelectionsService.userSelections.trainingId;
            getByTrainingId(trainingId);
        }
    }, [authUser, firebaseContext, userSelectionsService])

    const getByTrainingId = (trainingId) => {
        firebaseContext.firebase.db.ref(`exercises`)
            .orderByKey()
            .equalTo(authUser.uid)
            .on('value', snapshot => {  
                const obj = snapshot.val();
                var exercises = obj[Object.keys(obj)][trainingId];
                if (exercises) {
                    const exercisesList = Object.keys(exercises).map(key => ({ 
                        ...exercises[key], 
                        id: key 
                    }));
                    console.log("Exercises loaded");
                    console.log(exercisesList);
                    setExercises(exercisesList);
                } else {
                    setExercises([]);
                }
            });
    }

    const add = (trainingId, exercise) => {
        firebaseContext.firebase.db.ref(`exercises/${authUser.uid}/${trainingId}`).push({
            description: exercise.description,
            name: exercise.name,
            series: [],
        })
    }

    const del = (trainingId,id) => {
        firebaseContext.firebase.db.ref(`exercises/${authUser.uid}/${trainingId}/${id}`).remove();
    }

    return (
        <ExercisesServiceContext.Provider
          value={{
            exercises: exercises,
            add: add,
            del: del,
          }}
        >
          {children}
        </ExercisesServiceContext.Provider>
      );
}

export default ExercisesService;
