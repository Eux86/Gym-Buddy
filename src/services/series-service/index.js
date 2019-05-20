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
                    .orderByKey()
                    .limitToLast(1)
                    .once('value', snapshot => {
                        const obj = snapshot.val();
                        const lastDayTimestamp = Object.keys(obj)[0];
                        const lastDay = obj[lastDayTimestamp]
                        const seriesList = lastDay && Object.keys(lastDay).map(key => ({ ...lastDay[key], id: key, day: lastDayTimestamp }));
                        res(seriesList);
                    });
            }
        });
    }

    const add = async (exerciseId, newSeries) => {
        const createDate = (new Date()).setHours(0, 0, 0, 0);

        const timestamp = await audit.add("AddSeries", JSON.stringify({ exerciseId, ...newSeries }));
        const newRef = firebaseContext.firebase.db.ref(`series/${authUser.uid}/${exerciseId}/${createDate}`).push();
        var updates = {
            [`series/${authUser.uid}/${exerciseId}/${createDate}/${newRef.key}`]: {
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
        const timestamp = await audit.add("EditSeries", JSON.stringify({ exerciseId, ...editedSeries }));
        var updates = {
            [`series/${authUser.uid}/${exerciseId}/${editedSeries.day}/${editedSeries.id}`]: {
                amount: +editedSeries.amount,
                repetitions: +editedSeries.repetitions,
                order: +editedSeries.order,
                createDate: editedSeries.createDate,
                timestamp
            }
        }
        return await firebaseContext.firebase.db.ref().update(updates);
    }

    const del = async (exerciseId, deletedSeries) => {
        const timestamp = await audit.add("DelSeries", JSON.stringify({ exerciseId, id: deletedSeries.id }));
        firebaseContext.firebase.db.ref(`series/${authUser.uid}/${exerciseId}/${deletedSeries.day}/${deletedSeries.id}`).remove();
    }

    const delByDate = async (exerciseId,date) => {
        const timestamp = await audit.add("delSeriesByDate", JSON.stringify({ exerciseId, date }));
        firebaseContext.firebase.db.ref(`series/${authUser.uid}/${exerciseId}/${date}`).remove();
    }

    

    return (
        <SeriesServiceContext.Provider
            value={{
                getLastDayByExerciseId: getLastDayByExerciseId,
                add: add,
                del: del,
                delByDate: delByDate,
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