import React, { useState, useEffect, useContext } from 'react'

import { FirebaseContext } from '../../services/firebase';
import { AuthUserContext } from '../authentication-service';
import * as DatetimeHelper from '../../utils/datetime-helper';
import { ExercisesServiceContext } from '../exercises-service';
import { AuditServiceContext } from '../audit-service';

export const SeriesServiceContext = React.createContext();

const SeriesService = ({ children }) => {
    const authUser = useContext(AuthUserContext);
    const audit = useContext(AuditServiceContext);
    const firebaseContext = useContext(FirebaseContext);
    const exercisesService = useContext(ExercisesServiceContext);

    const getLastDayByExerciseId = (exerciseId) => {
        return new Promise((res, rej) => {
            if (!firebaseContext.firebase || !authUser) {
                res(null);
            } else {
                firebaseContext.firebase.db.ref(`series/${authUser.uid}/${exerciseId}/`)
                    .once('value', snapshot => {
                        const obj = snapshot.val();
                        const seriesList = obj && Object.keys(obj).map(key => ({ ...obj[key], id: key }));
                        if (seriesList) {
                            const seriesByDate = groupBy(seriesList, (x) => DatetimeHelper.getUtcDateWithoutTime(new Date(x.createDate)).toISOString());
                            const orderedDates = Object.keys(seriesByDate).sort((a, b) => {
                                return new Date(a) <= new Date(b) ? 1 : -1;
                            });
                            const mostRecentMoment = orderedDates[0];
                            const latestDaysSeries = seriesByDate[mostRecentMoment] || [];
                            res(latestDaysSeries);
                        } else {
                            res([]);
                        }
                    });
            }
        });
    }

    const add = async (exerciseId, newSeries) => {
        // addint a temporary item to the array so that an item can be seen in the app meanwhile we wait for the server response 
        // setSeries([...series, { ...newSeries, temp: true }]);

        const currentExercise = await exercisesService.getById(exerciseId);
        const timestamp = await audit.add("AddSeries", JSON.stringify({ exerciseId, ...newSeries }));
        const newRef = firebaseContext.firebase.db.ref(`series/${authUser.uid}/${exerciseId}`).push();
        var updates = {
            [`series/${authUser.uid}/${exerciseId}/${newRef.key}`]: {
                amount: +newSeries.amount,
                repetitions: +newSeries.repetitions,
                order: +newSeries.order,
                createDate: newSeries.createDate,
                timestamp
            }
        }

        return await firebaseContext.firebase.db.ref().update(updates);
    }


    const edit = async (exerciseId, editedSeries) => {
        const currentExercise = await exercisesService.getById(exerciseId);
        const timestamp = await audit.add("EditSeries", JSON.stringify({ exerciseId, ...editedSeries }));
        var updates = {
            [`series/${authUser.uid}/${exerciseId}/${editedSeries.id}`]: {
                amount: +editedSeries.amount,
                repetitions: +editedSeries.repetitions,
                order: +editedSeries.order,
                createDate: editedSeries.createDate,
                timestamp
            }
        }
        return await firebaseContext.firebase.db.ref().update(updates);
    }

    const del = async (exerciseId, id) => {
        const timestamp = await audit.add("DelSeries", JSON.stringify({ exerciseId, id }));
        firebaseContext.firebase.db.ref(`series/${authUser.uid}/${exerciseId}/${id}`).remove();
    }

    return (
        <SeriesServiceContext.Provider
            value={{
                getLastDayByExerciseId: getLastDayByExerciseId,
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


export const groupBy = (list, fun) => {
    return list.reduce((acc, listEl) => {
        if (!acc[fun(listEl)]) {
            acc = { ...acc, [fun(listEl)]: [listEl] };
        } else {
            acc[fun(listEl)].push(listEl);
        }
        return acc
    }, {})
};