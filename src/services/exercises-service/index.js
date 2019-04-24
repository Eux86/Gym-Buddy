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
            debugger;
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
                    setExercises(exercisesList);
                } else {
                    setExercises([]);
                }
            });
    }

    const add = (exercise) => {

    }

    const del = (id) => {

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
