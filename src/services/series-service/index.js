import React, {useState, useEffect, useContext} from 'react'

import { FirebaseContext } from '../../services/firebase';
import { AuthUserContext } from '../authentication-service';
import { UserSelectionsServiceContext } from '../user-selection-service';

export const SeriesServiceContext = React.createContext();

const SeriesService = ({children}) => {
    const authUser = useContext(AuthUserContext);
    const firebaseContext = useContext(FirebaseContext);
    const userSelectionsService = useContext(UserSelectionsServiceContext);
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
        firebaseContext.firebase.db.ref(`series`)
            .orderByKey()
            .equalTo(authUser.uid)
            .on('value', snapshot => {  
                const obj = snapshot.val();
                let series = obj && obj[Object.keys(obj)][exerciseId];
                if (series) {
                    const seriesList = Object.keys(series).map(key => ({ 
                        ...series[key], 
                        id: key 
                    }));
                    console.log("Series loaded");
                    console.log(seriesList);
                    setSeries(seriesList);
                } else {
                    setSeries([]);
                }
            });
    }

    const add = (exerciseId, series) => {
        firebaseContext.firebase.db.ref(`series/${authUser.uid}/${exerciseId}`).push({
            repetitions: series.repetitions,
            amount: series.amount,
            order: series.order,
            createDate: series.createDate,            
        })
    }

    const edit = (exerciseId, series) => {
        firebaseContext.firebase.db.ref(`series/${authUser.uid}/${exerciseId}/${series.id}`).set({
            repetitions: series.repetitions,
            amount: series.amount,
            order: series.order,
            createDate: series.createDate,
        })
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
