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
            debugger;
            get();
        }
    }, [authUser, firebaseContext])

    const get = () => {
        debugger;
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
                setTrainings( trainingSets );
            }
        });
    }

    const add = async (name) => {
        firebaseContext.firebase.db.ref(`trainings/${authUser.uid}`).push({
            name: name,
            exercises: [],
        })
    }

    const del = async (id) => {
        firebaseContext.firebase.db.ref(`trainings/${authUser.uid}/${id}`).remove();
    }

    const getExercisesByTrainingId = (trainingId) => {
        return new Promise( resolve => {
            firebaseContext.firebase.db.ref(`exercises`)
            .orderByKey()
            .equalTo(authUser.uid)
            .once('value', snapshot => {  
                const obj = snapshot.val();
                var exercises = obj[Object.keys(obj)][trainingId];
                if (exercises) {
                    const exercisesList = Object.keys(exercises).map(key => ({ 
                        ...exercises[key], 
                        id: key 
                    }));
                    resolve(exercisesList);
                } else {
                    resolve([]);
                }
            });
        });
    }

    return (
        <TrainingsServiceContext.Provider
          value={{
            trainings: trainings,
            add: add,
            del: del,
            getExercisesByTrainingId: getExercisesByTrainingId
          }}
        >
          {children}
        </TrainingsServiceContext.Provider>
      );
}

export default TrainingsService;
