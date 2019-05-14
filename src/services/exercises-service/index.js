import React, { useState, useEffect, useContext } from 'react'

import { FirebaseContext } from '../../services/firebase';
import { AuthUserContext } from '../authentication-service';
import { UserSelectionsServiceContext } from '../user-selection-service';
import { AuditServiceContext } from '../audit-service';

export const ExercisesServiceContext = React.createContext();


const ExercisesService = ({ children }) => {
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
                const exercisesList = obj && Object.keys(obj).map(key => ({ ...obj[key], id: key }));
                if (exercisesList) {
                    setExercises(exercisesList);
                } else {
                    setExercises([]);
                }
            });
    }

    const add = async (trainingId, exercise) => {
        // addint a temporary item to the array so that an item can be seen in the app meanwhile we wait for the server response 
        setExercises([...exercises, { ...exercise, temp: true }]);

        const timestamp = await audit.add("AddTraining", JSON.stringify({ trainingId, exercise }));
        await firebaseContext.firebase.db.ref(`users/${authUser.uid}`).update({ lastWrite: timestamp });
        firebaseContext.firebase.db.ref(`exercises/${authUser.uid}`).push({
            trainingId: trainingId,
            description: exercise.description,
            name: exercise.name,
            order: exercise.order,
            timestamp
        })
    }

    const update = async (trainingId, exercise) => {
        // adding a temporary item to the array so that an item can be seen in the app meanwhile we wait for the server response 
        const original = exercises.find(x => x.id === exercise.id);
        const tempExercises = [...exercises];
        tempExercises.splice(tempExercises.indexOf(original), 1, { ...exercise, temp: true })
        setExercises(tempExercises);

        const timestamp = await audit.add("AddTraining", JSON.stringify({ trainingId, exercise }));
        await firebaseContext.firebase.db.ref(`exercises/${authUser.uid}/${exercise.id}`)
            .update({
                trainingId: trainingId,
                description: exercise.description,
                name: exercise.name,
                order: exercise.order || 0,
                timestamp
            });
    }


    const del = async (trainingId, exercise) => {
        // adding a temporary item to the array so that an item can be seen in the app meanwhile we wait for the server response 
        const original = exercises.find(x => x.id === exercise.id);
        const tempExercises = [...exercises];
        tempExercises.splice(tempExercises.indexOf(original), 1, { ...original, temp: true })
        setExercises(tempExercises);

        var updates = {
            [`exercises/${authUser.uid}/${exercise.id}`]: null,
            [`series/${authUser.uid}/${exercise.id}`]: null,
        }
        await new Promise(resolve => setTimeout(resolve, 2000));

        await firebaseContext.firebase.db.ref().update(updates);
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
