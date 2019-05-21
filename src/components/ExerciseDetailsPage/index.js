import './index.css';

import React, { useContext, useState, useEffect } from 'react';
import { ExercisesServiceContext } from '../../services/exercises-service';
import { SeriesServiceContext } from '../../services/series-service';
import EditableTitle from '../common/editable-title/editable-title';
import * as DatetimeHelper from '../../utils/datetime-helper';
import BackBar from '../common/back-bar/back-bar';
import { TrainingsServiceContext } from '../../services/trainings-service';
import CrudList from '../common/crud-list/crud-list';
import TwoColumnsItemTemplate from '../common/crud-list/item-templates/two-columns-item-template';
import TwoColumnsItemEditorTemplate from '../common/crud-list/item-templates/two-columns-editor-item-template';


const ExerciseDetailsPage = (props) => {
    const [state, setState] = useState({
        currentExercise: null,
        currentTraining: null,
        latestDaysSeries: null
    })
    console.log("Exercise details page rerender");
    const exercisesService = useContext(ExercisesServiceContext);
    const trainingsService = useContext(TrainingsServiceContext);
    const seriesService = useContext(SeriesServiceContext);
    const currentExerciseId = props.match.params.exerciseId;
    const currentTrainingId = props.match.params.trainingId;

    let doneToday = false;
    let latestDaysSeries = state.latestDaysSeries;

    const mostRecentMoment = state.latestDaysSeries && state.latestDaysSeries.length > 0 && DatetimeHelper.getUtcDateWithoutTime(new Date(state.latestDaysSeries[0].createDate));
    if (mostRecentMoment) {
        doneToday = mostRecentMoment.getTime() === DatetimeHelper.getUtcDateWithoutTime(new Date()).getTime();
    }

    useEffect(() => {
        init();
    }, [seriesService, trainingsService, exercisesService]);

    const init = async () => {
        await refreshTraining();
        await refreshExercise();
        await refreshList();
    }

    const refreshList = async () => {
        const latestDaysSeries = await seriesService.getLastDayByExerciseId(currentExerciseId);
        setState(state => ({ ...state, latestDaysSeries }));

        if (state.currentExercise && latestDaysSeries && latestDaysSeries.length > 0) {
            const lastUpdateDate = DatetimeHelper.getUtcDateWithoutTime(new Date(latestDaysSeries[0].createDate));
            exercisesService.update(currentTrainingId, { ...state.currentExercise, lastUpdateDate })
        }
    }

    const refreshExercise = async () => {
        const currentExercise = await exercisesService.getById(currentExerciseId);
        setState(state => ({ ...state, currentExercise }));
    }

    const refreshTraining = async () => {
        const currentTraining = await trainingsService.getById(currentTrainingId);
        setState(state => ({ ...state, currentTraining }));
    }

    const onDeleteInternal = async (seriesToDelete) => {
        const tempSeries = state.latestDaysSeries;
        tempSeries.splice(tempSeries.indexOf(seriesToDelete), 1, { ...seriesToDelete, temp: true })
        setState({ ...state, latestDaysSeries: tempSeries });

        const seriesToDeleteCreateDate = DatetimeHelper.getUtcDateWithoutTime(new Date(seriesToDelete.createDate));
        const today = DatetimeHelper.getUtcDateWithoutTime(new Date());
        const copySeriesToNewDate = seriesToDeleteCreateDate.getTime() != today.getTime();
        if (copySeriesToNewDate) {
            // if it is an entry from an older day's series, then make a copy for today and just don't copy this 
            // series that we want to delete 
            for (let entry of latestDaysSeries) {
                if (entry.id !== seriesToDelete.id) {
                    await seriesService.add(currentExerciseId, { ...entry, createDate: today.toISOString() });
                }
            }
        } else {
            // if it is an entry from today's series, then just delete it
            await seriesService.del(currentExerciseId, seriesToDelete);
        }

        refreshList();
    }

    const onAddSeries = async (newSeries) => {
        setState({ ...state, latestDaysSeries: [...state.latestDaysSeries, { ...newSeries, temp: true }] });

        const order = latestDaysSeries.length == 0 ? 0 : Math.max(...latestDaysSeries.map(x => +x.order)) + 1;
        const today = (new Date()).toISOString();
        const toAdd = { ...newSeries, order: order, createDate: today };
        const result = await seriesService.add(currentExerciseId, toAdd);

        // If the other presented series are older, then we make a copy of them with today's date
        await copySeriesWithTodaysDate(latestDaysSeries);

        refreshList();
    }

    const editSerie = async (original, edited) => {
        const tempSeries = state.latestDaysSeries;
        tempSeries.splice(tempSeries.indexOf(original), 1, { ...edited, temp: true })
        setState({ ...state, latestDaysSeries: tempSeries });

        const originalDate = DatetimeHelper.getUtcDateWithoutTime(new Date(original.createDate));
        const today = DatetimeHelper.getUtcDateWithoutTime(new Date());
        const copySeriesToNewDate = originalDate.getTime() != today.getTime();
        if (copySeriesToNewDate) {
            for (let entry of latestDaysSeries) {
                if (entry.id === edited.id) {
                    await seriesService.add(currentExerciseId, { ...edited, createDate: today.toISOString() });
                } else {
                    await seriesService.add(currentExerciseId, { ...entry, createDate: today.toISOString() });
                }
            }
        } else {
            await seriesService.edit(currentExerciseId, { ...edited, createDate: today.toISOString() });
        }
        refreshList();
    }

    const onExerciseTitleChange = async (newTitle) => {
        await exercisesService.update(currentTrainingId, { ...state.currentExercise, name: newTitle });
        refreshExercise();
    }

    const onDoneTodayClick = async () => {
        await copySeriesWithTodaysDate(latestDaysSeries);
        refreshList();
        refreshExercise();
    }

    const onUndoTodayClick = async () => {
        if (window.confirm("All edits done today will be canceled, are you sure?")) {
            const today = new Date().setHours(0, 0, 0, 0);
            await seriesService.delByDate(currentExerciseId, today);
        }
        refreshList();
        refreshExercise();
    }

    const copySeriesWithTodaysDate = async (series) => {
        if (series) {
            const today = (new Date()).toISOString();
            for (let entry of series) {
                // If this series was added in the past, then make a copy with today's date
                if (DatetimeHelper.getUtcDateWithoutTime(new Date(entry.createDate)).getTime() !== DatetimeHelper.getUtcDateWithoutTime(new Date(today)).getTime()) {
                    await seriesService.add(currentExerciseId, { ...entry, createDate: today });
                }
            }
        }
    }



    return (state.currentExercise &&
        <div id="exercise-details-container" className={"container-fluid " + (doneToday && "flash")}>
            <BackBar label={"Back to " + (state.currentTraining && state.currentTraining.name)} linkTarget={`/training/${currentTrainingId}`} history={props.history} />
            {state.currentExercise &&
                <>
                    <EditableTitle title={state.currentExercise.name} onChange={onExerciseTitleChange} />
                    <span className="text-muted">Last updated: {new Date(mostRecentMoment).toLocaleDateString()}</span>
                </>
            }
            {state.latestDaysSeries &&
                <CrudList
                    items={latestDaysSeries}
                    onItemDelete={onDeleteInternal}
                    onItemAdd={onAddSeries}
                    onItemEdit={(original, edited) => editSerie(original, edited)}
                    itemTemplate={<TwoColumnsItemTemplate />}
                    itemEditTemplate={<TwoColumnsItemEditorTemplate />}
                    itemHeader={<TwoColumnsItemTemplate item={{ repetitions: 'Repetitions', amount: 'Amount' }} />}
                />
            }
            {!state.latestDaysSeries &&
                <p className="text-muted text-center mt-5">
                    Loading...
                </p>
            }
            {state.latestDaysSeries && 
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
            }
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




