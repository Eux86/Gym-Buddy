import React, {useState, useEffect, useContext} from 'react'

import { FirebaseContext } from '../../services/firebase';
import { AuthUserContext } from '../authentication-service';
import { UserSelectionsServiceContext } from '../user-selection-service';
import { AuditServiceContext } from '../audit-service';

export const ExercisesServiceContext = React.createContext();


const ExercisesService = ({children}) => {
    const authUser = useContext(AuthUserContext);
    const audit = useContext(AuditServiceContext);
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
        const timestamp = await audit.add("AddTraining", JSON.stringify({trainingId, exercise}));
        await firebaseContext.firebase.db.ref(`users/${authUser.uid}`).update({lastWrite: timestamp});
        firebaseContext.firebase.db.ref(`exercises/${authUser.uid}`).push({
            trainingId: trainingId,
            description: exercise.description,
            name: exercise.name,
            order: exercise.order,
            timestamp
        })
    }

    const del = (trainingId,id) => {
        var updates = {
            [`exercises/${authUser.uid}/${id}`]: null,
            [`series/${authUser.uid}/${id}`]: null,
          }
        firebaseContext.firebase.db.ref().update(updates);
    }

    const update = async (trainingId, exercise) => {
        const timestamp = await audit.add("AddTraining", JSON.stringify({trainingId, exercise}));
        await firebaseContext.firebase.db.ref(`exercises/${authUser.uid}/${exercise.id}`)
            .update({
                trainingId: trainingId,
                description: exercise.description,
                name: exercise.name,
                order: exercise.order,
                timestamp
            });
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
