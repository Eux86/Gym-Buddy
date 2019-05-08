import React, {useState, useEffect, useContext} from 'react'

import { FirebaseContext } from '../../services/firebase';
import { AuthUserContext } from '../authentication-service';
import { UserSelectionsServiceContext } from '../user-selection-service';
import * as DatetimeHelper from '../../utils/datetime-helper';
import { ExercisesServiceContext } from '../exercises-service';

export const SeriesServiceContext = React.createContext();

const SeriesService = ({children}) => {
    const authUser = useContext(AuthUserContext);
    const firebaseContext = useContext(FirebaseContext);
    const userSelectionsService = useContext(UserSelectionsServiceContext);
    const exercisesService = useContext(ExercisesServiceContext);
    const [series, setSeries] = useState(null);

    
    useEffect(() => {
        const exerciseId = userSelectionsService.userSelections.exerciseId;
        if (authUser && 
            firebaseContext.firebase && 
            exerciseId) {
            getByExerciseId(exerciseId);
        }
    }, [authUser, firebaseContext, userSelectionsService])

    const getByExerciseId = (exerciseId) => {
            firebaseContext.firebase.db.ref(`series/${authUser.uid}/${exerciseId}/`)
            .on('value', snapshot => {  
                const obj = snapshot.val();
                const seriesList = obj && Object.keys(obj).map( key => ({...obj[key], id: key }) );
                if (seriesList) {
                    setSeries(seriesList);
                } else {
                    setSeries([]);
                }
            });
    }

    const add = async (exerciseId, series) => {
        const trainingId = userSelectionsService.userSelections.trainingId;
        const currentExercise = exercisesService.exercises.find(x => x.id == exerciseId);
        
        const timestamp = new Date().getTime();
        await firebaseContext.firebase.db.ref(`users/${authUser.uid}`).update({lastWrite: timestamp});

        const newRef = firebaseContext.firebase.db.ref(`series/${authUser.uid}/${exerciseId}`).push();
        var updates = {
            [`series/${authUser.uid}/${exerciseId}/${newRef.key}`]: {
                ...series,   
                timestamp      
            },
            [`exercises/${authUser.uid}/${trainingId}/${exerciseId}`]:{
                ...currentExercise,
                timestamp: timestamp,
                lastUpdateDate: DatetimeHelper.getUtcDateWithoutTime(new Date()).toISOString(),
            },
          }
        firebaseContext.firebase.db.ref().update(updates);
    }

    const edit = async (exerciseId, series) => {
        const trainingId = userSelectionsService.userSelections.trainingId;
        const currentExercise = exercisesService.exercises.find(x => x.id == exerciseId);

        const timestamp = new Date().getTime();
        await firebaseContext.firebase.db.ref(`users/${authUser.uid}`).update({lastWrite: timestamp});
        
        var updates = {
            [`series/${authUser.uid}/${exerciseId}/${series.id}`]: {
                ...series,    
                timestamp      
            },
            [`exercises/${authUser.uid}/${trainingId}/${exerciseId}`]:{
                ...currentExercise,
                timestamp: timestamp,
                lastUpdateDate: DatetimeHelper.getUtcDateWithoutTime(new Date()).toISOString(),
            },
          }
        firebaseContext.firebase.db.ref().update(updates);
    }

    const del = (exerciseId, id) => {
        firebaseContext.firebase.db.ref(`series/${authUser.uid}/${exerciseId}/${id}`).remove();
    }

    return (
        <SeriesServiceContext.Provider
          value={{
            series: series,
            add: add,
            del: del,
            edit: edit,
          }}
        >
          {children}
        </SeriesServiceContext.Provider>
      );
}

export default SeriesService;
