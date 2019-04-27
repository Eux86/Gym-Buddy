import './index.css';

import React, { useContext, useState, useEffect } from 'react';
import { UserSelectionsServiceContext } from '../../services/user-selection-service';
import { ExercisesServiceContext } from '../../services/exercises-service';
import TableControls from './table-controls';
import { SeriesServiceContext } from '../../services/series-service';
import SeriesEntryTableRow from './series-entry-table-row';

const ExerciseDetailsPage = (props) => {
    const userSelectionsService = useContext(UserSelectionsServiceContext);

    const exercisesService = useContext(ExercisesServiceContext);
    const seriesService = useContext(SeriesServiceContext);
    const currentExerciseId = userSelectionsService.userSelections.exerciseId;
    const currentExercise = exercisesService && exercisesService.exercises && exercisesService.exercises.find(x => x.id === currentExerciseId);

    let series = null;
    let mostRecentMoment = null;

    if (seriesService.series) {
        const seriesByDate = groupBy(seriesService.series, (x) => getUtcDateWithoutTime(new Date(x.createDate)).toISOString());
        const orderedDates = Object.keys(seriesByDate).sort((a, b) => {
            return new Date(a) <= new Date(b) ? 1 : -1;
        });
        mostRecentMoment = orderedDates[0];
        series = seriesByDate[mostRecentMoment];
    }

    const del = (seriesId) => {
        seriesService.del(currentExerciseId, seriesId);
    }

    const addSeries = (newSeries) => {
        const currentExerciseId = userSelectionsService.userSelections.exerciseId;
        let order = Math.max(...series.map(x => +x.order)) + 1;
        let createDate = (new Date()).toISOString();
        seriesService.add(currentExerciseId, { ...newSeries, order: order, createDate });
        
        // If the other presented series are older, then we make a copy of them with today's date
        for (let entry of series) {
            if (getUtcDateWithoutTime(new Date(entry.createDate)).getTime() !== getUtcDateWithoutTime(new Date(createDate)).getTime()) {
                seriesService.add(currentExerciseId, {...entry, createDate: createDate});
            }
        }
    }

    const editSerie = (original, edited) => {
        const originalDate = getUtcDateWithoutTime(new Date(original.createDate));
        const today = getUtcDateWithoutTime(new Date());
        const copySeriesToNewDate = originalDate.getTime() != today.getTime();
        if (copySeriesToNewDate){
            for (let entry of series) {
                if (entry.id === edited.id) {
                    seriesService.add(currentExerciseId, {...edited, createDate: today.toISOString()});
                } else {
                    seriesService.add(currentExerciseId, {...entry, createDate: today.toISOString()});
                }
            }
        } else {
            seriesService.edit(currentExerciseId, {...edited, createDate: today.toISOString()});
        }
    }

    return (currentExercise &&
        <div>
            <h1>{currentExercise.name}</h1>
            <span className="text-muted">Last updated: {new Date(mostRecentMoment).toLocaleDateString()}</span>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Repetitions</th>
                        <th scope="col">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {series &&
                        series.map(serie =>
                            <SeriesEntryTableRow key={serie.id} serie={serie} del={del} edit={(editedSerie) => editSerie(serie, editedSerie)} />
                        )}
                    <TableControls addSeries={addSeries} />
                </tbody>
            </table>
        </div>
    );
};


export default ExerciseDetailsPage;

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

export const getUtcDateWithoutTime = (date) => {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}