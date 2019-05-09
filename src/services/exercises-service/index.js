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
        firebaseContext.firebase.db.ref(`exercises/${authUser.uid}/`)
            .orderByChild('trainingId')
            .equalTo(trainingId)
            .on('value', snapshot => {  
                const obj = snapshot.val();
                const exercisesList = obj && Object.keys(obj).map( key => ({...obj[key], id: key }) );
                if (exercisesList) {
                    setExercises(exercisesList);
                } else {
                    setExercises([]);
                }
            });
    }

    const add = async (trainingId, exercise) => {
        const timestamp = new Date().getTime();
        console.log("TrainingId: "+trainingId);
        await firebaseContext.firebase.db.ref(`users/${authUser.uid}`).update({lastWrite: timestamp});
        firebaseContext.firebase.db.ref(`exercises/${authUser.uid}`).push({
            trainingId: trainingId,
            description: exercise.description,
            name: exercise.name,
            order: exercise.order
        })
    }

    const del = (trainingId,id) => {
        var updates = {
            [`exercises/${authUser.uid}/${id}`]: null,
            [`series/${authUser.uid}/${id}`]: null,
          }
          debugger;
        firebaseContext.firebase.db.ref().update(updates);
    }

    const update = async (trainingId, exercise) => {
        const timestamp = new Date().getTime();
        await firebaseContext.firebase.db.ref(`users/${authUser.uid}`).update({lastWrite: timestamp});
        var updates = {
            [`exercises/${authUser.uid}/${trainingId}/${exercise.id}`]: {
                ...exercise,
                timestamp
            }
          }
        firebaseContext.firebase.db.ref().update(updates);
    }

    return (
        <ExercisesServiceContext.Provider
          value={{
            exercises: exercises,
            add: add,
            del: del,
            update: update,
          }}
        >
          {children}
        </ExercisesServiceContext.Provider>
      );
}

export default ExercisesService;
