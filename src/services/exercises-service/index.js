import React, { useState, useEffect, useContext } from 'react'

import { FirebaseContext } from '../../services/firebase';
import { AuthUserContext } from '../authentication-service';
import { AuditServiceContext } from '../audit-service';

export const ExercisesServiceContext = React.createContext();


const ExercisesService = ({ children }) => {
    const authUser = useContext(AuthUserContext);
    const audit = useContext(AuditServiceContext);
    const firebaseContext = useContext(FirebaseContext);

    const getByTrainingId = (trainingId) => {
        console.log("getByTrainingId");
        return new Promise((res, rej) => {
            if (!firebaseContext.firebase || !authUser) {
                console.log("Exercise service: not ready, returning empty array");
                res(null);
            } else {
                console.log("Querying fb");
                firebaseContext.firebase.db.ref(`exercises/${authUser.uid}/`)
                    .orderByChild('trainingId')
                    .equalTo(trainingId)
                    .once('value', snapshot => {
                        console.log("Fetching from firebase")

                        const obj = snapshot.val();
                        const exercisesList = obj && Object.keys(obj).map(key => ({ ...obj[key], id: key }));
                        if (exercisesList) {
                            res(exercisesList);
                        } else {
                            res([]);
                        }
                    });
            }
        });
    }

    const getById = (exerciseId) => {
        console.log("getByTrainingId");
        return new Promise((res, rej) => {
            if (!firebaseContext.firebase || !authUser) {
                res(null);
            } else {
                firebaseContext.firebase.db.ref(`exercises/${authUser.uid}/${exerciseId}`)
                    .once('value', snapshot => {
                        const obj = snapshot.val();
                        const exercises = {id: snapshot.key, ...obj};
                        if (exercises) {
                            res(exercises);
                        } else {
                            res([]);
                        }
                    });
            }
        });
    }

    const add = async (trainingId, exercise) => {
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


    const del = async (exercise) => {
        var updates = {
            [`exercises/${authUser.uid}/${exercise.id}`]: null,
            [`series/${authUser.uid}/${exercise.id}`]: null,
        }
        await firebaseContext.firebase.db.ref().update(updates);
    }

    return (
        <ExercisesServiceContext.Provider
            value={{
                getByTrainingId: getByTrainingId,
                getById: getById,
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
