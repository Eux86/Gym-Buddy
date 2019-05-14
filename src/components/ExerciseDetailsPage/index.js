import './index.css';

import React, { useContext, useState, useEffect } from 'react';
import { UserSelectionsServiceContext } from '../../services/user-selection-service';
import { ExercisesServiceContext } from '../../services/exercises-service';
import TableControls from './table-controls';
import { SeriesServiceContext } from '../../services/series-service';
import SeriesEntryTableRow from './series-entry-table-row';
import EditableTitle from '../common/editable-title/editable-title';
import * as DatetimeHelper from '../../utils/datetime-helper';
import BackBar from '../common/back-bar/back-bar';
import { TrainingsServiceContext } from '../../services/trainings-service';
import CrudList from '../common/crud-list/crud-list';
import TwoColumnsItemTemplate from '../common/crud-list/item-templates/two-columns-item-template';
import TwoColumnsItemEditorTemplate from '../common/crud-list/item-templates/two-columns-editor-item-template';


const ExerciseDetailsPage = (props) => {
    console.log("Exercise details page rerender");
    const userSelectionsService = useContext(UserSelectionsServiceContext);
    const exercisesService = useContext(ExercisesServiceContext);
    const trainingsService = useContext(TrainingsServiceContext);
    const seriesService = useContext(SeriesServiceContext);
    const currentExerciseId = userSelectionsService.userSelections.exerciseId;
    const currentTrainingId = userSelectionsService.userSelections.trainingId;
    const currentExercise = exercisesService && exercisesService.exercises && exercisesService.exercises.find(x => x.id === currentExerciseId) || null;
    const currentTraining = trainingsService && trainingsService.trainings && trainingsService.trainings.find(x => x.id === currentTrainingId) || null;
    let doneToday = false;

    let latestDaysSeries = null;
    let mostRecentMoment = currentExercise && currentExercise.lastUpdateDate;

    useEffect(()=>{},[latestDaysSeries]);

    if (seriesService.series && seriesService.series.length>0) {
        const seriesByDate = groupBy(seriesService.series, (x) => DatetimeHelper.getUtcDateWithoutTime(new Date(x.createDate)).toISOString());
        const orderedDates = Object.keys(seriesByDate).sort((a, b) => {
            return new Date(a) <= new Date(b) ? 1 : -1;
        });
        mostRecentMoment = orderedDates[0];
        //exercisesService.update(userSelectionsService.userSelections.trainingId, { ...currentExercise, lastUpdateDate: mostRecentMoment });
        latestDaysSeries = seriesByDate[mostRecentMoment];
    }

    if (mostRecentMoment) {
        doneToday = DatetimeHelper.getUtcDateWithoutTime(new Date(mostRecentMoment)).getTime() === DatetimeHelper.getUtcDateWithoutTime(new Date()).getTime();
    }

    const del = (seriesToDelete) => {
        const seriesToDeleteCreateDate = DatetimeHelper.getUtcDateWithoutTime(new Date(seriesToDelete.createDate));
        const today = DatetimeHelper.getUtcDateWithoutTime(new Date());
        const copySeriesToNewDate = seriesToDeleteCreateDate.getTime() != today.getTime();
        if (copySeriesToNewDate) {
            // if it is an entry from an older day's series, then make a copy for today and just don't copy this 
            // series that we want to delete 
            for (let entry of latestDaysSeries) {
                if (entry.id !== seriesToDelete.id) {
                    seriesService.add(currentExerciseId, { ...entry, createDate: today.toISOString() });
                }
            }
        } else {
            // if it is an entry from today's series, then just delete it
            seriesService.del(currentExerciseId, seriesToDelete.id);
        }
    }

    const onAddSeries = async (newSeries) => {
        const order = latestDaysSeries ? Math.max(...latestDaysSeries.map(x => +x.order)) + 1 : 0;
        const today = (new Date()).toISOString();
        const toAdd = { ...newSeries, order: order, createDate: today };
        latestDaysSeries.push(toAdd);
        const result = await seriesService.add(currentExerciseId, toAdd);
        
        // If the other presented series are older, then we make a copy of them with today's date
        copySeriesWithTodaysDate(latestDaysSeries);
    }

    const editSerie = (original, edited) => {
        const originalDate = DatetimeHelper.getUtcDateWithoutTime(new Date(original.createDate));
        const today = DatetimeHelper.getUtcDateWithoutTime(new Date());
        const copySeriesToNewDate = originalDate.getTime() != today.getTime();
        if (copySeriesToNewDate) {
            for (let entry of latestDaysSeries) {
                if (entry.id === edited.id) {
                    seriesService.add(currentExerciseId, { ...edited, createDate: today.toISOString() });
                } else {
                    seriesService.add(currentExerciseId, { ...entry, createDate: today.toISOString() });
                }
            }
        } else {
            seriesService.edit(currentExerciseId, { ...edited, createDate: today.toISOString() });
        }
    }

    const onExerciseTitleChange = (newTitle) => {
        exercisesService.update(userSelectionsService.userSelections.trainingId, { ...currentExercise, name: newTitle });
    }

    const onDoneTodayClick = (event) => {
        copySeriesWithTodaysDate(latestDaysSeries);
    }

    const onUndoTodayClick = (event) => {
        if (window.confirm("All edits done today will be canceled, are you sure?")){
            const today = (new Date()).toISOString();
            for (let entry of latestDaysSeries) {
                if (DatetimeHelper.getUtcDateWithoutTime(new Date(entry.createDate)).getTime() === DatetimeHelper.getUtcDateWithoutTime(new Date(today)).getTime()) {
                    seriesService.del(currentExerciseId, entry.id);
                }
            }
        }
    }

    const copySeriesWithTodaysDate = (series) => {
        if (series){
            const today = (new Date()).toISOString();
            for (let entry of series) {
                // If this series was added in the past, then make a copy with today's date
                if (DatetimeHelper.getUtcDateWithoutTime(new Date(entry.createDate)).getTime() !== DatetimeHelper.getUtcDateWithoutTime(new Date(today)).getTime()) {
                    seriesService.add(currentExerciseId, { ...entry, createDate: today });
                }
            }
        }
    }

    return (currentExercise &&
        <div id="exercise-details-container" className={"container-fluid "+(doneToday && "flash")}>
            <BackBar label={"Back to "+ (currentTraining && currentTraining.name)} linkTarget="/training" history={props.history} />            
            <EditableTitle title={currentExercise.name} onChange={onExerciseTitleChange} />
            <span className="text-muted">Last updated: {new Date(mostRecentMoment).toLocaleDateString()}</span>
            {latestDaysSeries && 
            <CrudList 
                    items={latestDaysSeries} 
                    onItemDelete={del} 
                    onItemAdd={onAddSeries}
                    onItemEdit={(original, edited) => editSerie(original,edited)}
                    itemTemplate={<TwoColumnsItemTemplate />}
                    itemEditTemplate={<TwoColumnsItemEditorTemplate/>}
                    itemHeader={<TwoColumnsItemTemplate item={{repetitions: 'Repetitions', amount: 'Amount'}} />}
                    />
            }
            <div className="row text-center">
                <div className="col">
                    <button
                        type="button"
                        className="btn btn-success"
                        disabled={doneToday || !latestDaysSeries || latestDaysSeries.length == 0}
                        onClick={onDoneTodayClick}>
                        Done today!
                    </button>
                </div>
            </div>
            {doneToday &&
                <div className="row text-center">
                    <div className="col">
                        <button
                            type="button"
                            className="btn btn-link"
                            onClick={onUndoTodayClick}>
                            (undo today)
                        </button>
                    </div>
                </div>
            }
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


