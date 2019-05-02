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
        firebaseContext.firebase.db.ref(`trainings`)
        .orderByKey()
        .equalTo(authUser.uid)
        .on('value', snapshot => {  
            const obj = snapshot.val();
            if (obj) {
                var trainings = obj[Object.keys(obj)[0]];
                const trainingSets = Object.keys(trainings).map(key => ({ 
                    ...trainings[key], 
                    id: key 
                }));
                console.log(trainingSets);
                setTrainings( trainingSets );
            } else {
                setTrainings([]);
            }
        });
    }

    const add = async (name) => {
        firebaseContext.firebase.db.ref(`trainings/${authUser.uid}`).push({
            name: name,
            exercises: [],
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

    const update = (editedTraining) => {
        var updates = {
            [`trainings/${authUser.uid}/${editedTraining.id}`]: editedTraining,
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
