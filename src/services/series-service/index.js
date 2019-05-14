import React, {useState, useEffect, useContext} from 'react'

import { FirebaseContext } from '../../services/firebase';
import { AuthUserContext } from '../authentication-service';
import { UserSelectionsServiceContext } from '../user-selection-service';
import * as DatetimeHelper from '../../utils/datetime-helper';
import { ExercisesServiceContext } from '../exercises-service';
import { AuditServiceContext } from '../audit-service';

export const SeriesServiceContext = React.createContext();

const SeriesService = ({children}) => {
    const authUser = useContext(AuthUserContext);
    const audit = useContext(AuditServiceContext);
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

    const add = async (exerciseId, newSeries) => {
        // addint a temporary item to the array so that an item can be seen in the app meanwhile we wait for the server response 
        setSeries([...series,{...newSeries, temp: true}]);
        
        const currentExercise = exercisesService.exercises.find(x => x.id == exerciseId);
        const timestamp = await audit.add("AddSeries", JSON.stringify({exerciseId, ...newSeries}));
        const newRef = firebaseContext.firebase.db.ref(`series/${authUser.uid}/${exerciseId}`).push();
        var updates = {
            [`series/${authUser.uid}/${exerciseId}/${newRef.key}`]: {
                amount: +newSeries.amount,
                repetitions: +newSeries.repetitions,
                order: +newSeries.order,
                createDate: newSeries.createDate,
                timestamp
            },
            [`exercises/${authUser.uid}/${exerciseId}`]:{
                ...currentExercise,
                lastUpdateDate: DatetimeHelper.getUtcDateWithoutTime(new Date()).toISOString(),
                timestamp
            },
          }

        return firebaseContext.firebase.db.ref().update(updates);
    }

    const edit = async (exerciseId, editedSeries) => {

        // adding a temporary item to the array so that an item can be seen in the app meanwhile we wait for the server response 
        const original = series.find(x=>x.id===editedSeries.id);
        const tempSeries = [...series];
        tempSeries.splice(tempSeries.indexOf(original),1,{...editedSeries, temp: true})
        setSeries(tempSeries);
        
        // await new Promise(resolve => setTimeout(resolve, 2000));

        const currentExercise = exercisesService.exercises.find(x => x.id == exerciseId);
        const timestamp = await audit.add("EditSeries", JSON.stringify({exerciseId, ...editedSeries}));
        var updates = {
            [`series/${authUser.uid}/${exerciseId}/${editedSeries.id}`]: {
                amount: +editedSeries.amount,
                repetitions: +editedSeries.repetitions,
                order: +editedSeries.order,
                createDate: editedSeries.createDate,
                timestamp  
            },
            [`exercises/${authUser.uid}/${exerciseId}`]:{
                ...currentExercise,
                lastUpdateDate: DatetimeHelper.getUtcDateWithoutTime(new Date()).toISOString(),
                timestamp
            },
          }
        firebaseContext.firebase.db.ref().update(updates);
    }

    const del = async (exerciseId, id) => {
        const timestamp = await audit.add("DelSeries", JSON.stringify({exerciseId, id}));
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
