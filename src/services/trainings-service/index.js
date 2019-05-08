import React, {useState, useEffect, useContext} from 'react'

import { FirebaseContext } from '../../services/firebase';
import { AuthUserContext } from '../authentication-service';

export const TrainingsServiceContext = React.createContext();


const TrainingsService = ({children}) => {
    const authUser = useContext(AuthUserContext);
    const firebaseContext = useContext(FirebaseContext);
    const [trainings, setTrainings] = useState(null);

    useEffect(() => {
        if (authUser && firebaseContext.firebase) {
            get();
        }
    }, [authUser, firebaseContext])

    const get = () => {
        firebaseContext.firebase.db.ref(`trainings/${authUser.uid}`)
        .on('value', snapshot => {  
            const obj = snapshot.val();
            const trainingSets = obj && Object.keys(obj).map( key => ({...obj[key], id: key }) );
            if (trainingSets) {
                setTrainings( trainingSets );
            } else {
                setTrainings([]);
            }
        });
    }

    const add = async (name) => {
        const timestamp = new Date().getTime();
        await firebaseContext.firebase.db.ref(`users/${authUser.uid}`).update({lastWrite: timestamp});
        await firebaseContext.firebase.db.ref(`trainings/${authUser.uid}`).push({
            name: name,
            timestamp: timestamp,
        })
    }

    const del = async (trainingId) => {
        firebaseContext.firebase.db.ref(`exercises/${authUser.uid}/${trainingId}`).once('value', snapshot => {
            var updates = {
                [`trainings/${authUser.uid}/${trainingId}`]: null,
                [`exercises/${authUser.uid}/${trainingId}`]: null,
              }
            const obj = snapshot.val();
            if (obj) {
                let currentTrainingExercises = Object.keys(obj);
                for (let exerciseId of currentTrainingExercises){
                    updates[`series/${authUser.uid}/${exerciseId}`]= null;
                }
            }
            firebaseContext.firebase.db.ref().update(updates);
        });
    }

    const update = async (editedTraining) => {
        const timestamp = new Date().getTime();
        await firebaseContext.firebase.db.ref(`users/${authUser.uid}`).update({lastWrite: timestamp});
        var updates = {
            [`trainings/${authUser.uid}/${editedTraining.id}`]: {
                ...editedTraining,
                timestamp
            },
          }
        firebaseContext.firebase.db.ref().update(updates);
    }

    return (
        <TrainingsServiceContext.Provider
          value={{
            trainings: trainings,
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
