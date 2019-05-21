import React, { useState, useEffect, useContext } from 'react'

import { FirebaseContext } from '../../services/firebase';
import { AuthUserContext } from '../authentication-service';
import { AuditServiceContext } from '../audit-service';

export const TrainingsServiceContext = React.createContext();


const TrainingsService = ({ children }) => {
    const authUser = useContext(AuthUserContext);
    const firebaseContext = useContext(FirebaseContext);
    const audit = useContext(AuditServiceContext);

    const get = () => {
        return new Promise((res, rej) => {
            if (!firebaseContext.firebase || !authUser) {
                res(null);
            } else {
                firebaseContext.firebase.db.ref(`trainings/${authUser.uid}`)
                    .once('value', snapshot => {
                        const obj = snapshot.val();
                        const trainingSets = obj && Object.keys(obj).map(key => ({ ...obj[key], id: key }));
                        if (trainingSets) {
                            res(trainingSets);
                        } else {
                            res([]);
                        }
                    });
            }
        })
    }

    const getById = (id) => {
        return new Promise((res, rej) => {
            if (!firebaseContext.firebase || !authUser) {
                res(null);
            } else {
                firebaseContext.firebase.db.ref(`trainings/${authUser.uid}/${id}`)
                    .once('value', snapshot => {
                        const obj = snapshot.val();
                        const training = {id: snapshot.key, ...obj}
                        if (training) {
                            res(training);
                        } else {
                            res({});
                        }
                    });
            }
        })
    }

    const add = async (name) => {
        const timestamp = await audit.add("AddTraining", JSON.stringify(name));
        await firebaseContext.firebase.db.ref(`trainings/${authUser.uid}`).push({
            name: name,
            timestamp: +timestamp
        })
    }

    const update = async (editedTraining) => {
        const timestamp = await audit.add("EditTraining", JSON.stringify(editedTraining));
        await firebaseContext.firebase.db.ref(`trainings/${authUser.uid}/${editedTraining.id}`)
            .update({
                ...editedTraining,
                timestamp
            });
    }

    const del = async (training) => {
        console.log("training-service: del");
        const timestamp = await audit.add("DelTraining", JSON.stringify(training.id));
        await firebaseContext.firebase.db.ref(`exercises/${authUser.uid}/${training.id}`).once('value', snapshot => {
            var updates = {
                [`trainings/${authUser.uid}/${training.id}`]: null,
                [`exercises/${authUser.uid}/${training.id}`]: null,
            }
            const obj = snapshot.val();
            if (obj) {
                let currentTrainingExercises = Object.keys(obj);
                for (let exerciseId of currentTrainingExercises) {
                    updates[`series/${authUser.uid}/${exerciseId}`] = null;
                }
            }
            firebaseContext.firebase.db.ref().update(updates);
            console.log("del from firebase");
        });
        console.log("training-service: done");
    }

    return (
        <TrainingsServiceContext.Provider
            value={{
                get: get,
                getById: getById,
                add: add,
                del: del,
                update: update,
            }}
        >
            {children}
        </TrainingsServiceContext.Provider>
    );
}

export default TrainingsService;
