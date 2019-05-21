import React, { useContext, useState, useEffect } from 'react';
import { ExercisesServiceContext } from '../../services/exercises-service';
import * as ROUTES from '../../constants/routes';
import { TrainingsServiceContext } from '../../services/trainings-service';
import EditableTitle from '../common/editable-title/editable-title';
import CrudList from '../common/crud-list/crud-list';
import * as DatetimeHelper from '../../utils/datetime-helper';
import BackBar from '../common/back-bar/back-bar';
import { SeriesServiceContext } from '../../services/series-service';


const INITIAL_STATE = {
    currentTraining: null,
    exercises: null
}

const TrainingDetailsPage = (props) => {
    console.log("re-render");
    const exercisesService = useContext(ExercisesServiceContext);
    const trainingService = useContext(TrainingsServiceContext);
    const seriesService = useContext(SeriesServiceContext);
    const [state, setState] = useState(INITIAL_STATE);

    const trainingId = props.match.params.id;

    useEffect(() => {
        refreshExercises();
        refreshTrainingName();
    }, [trainingService, exercisesService])

    const refreshTrainingName = () => {
        trainingService.getById(trainingId).then(currentTraining => {
            console.log("Promise resolved with " + currentTraining);
            setState(state=> ({ ...state, currentTraining }));
        });
    }

    const refreshExercises = () => {
        exercisesService.getByTrainingId(trainingId).then(exercises => {
            console.log("Promise resolved with " + exercises);
            setState(state => ({ ...state, exercises }));
        });
    }

    const deleteExercise = async (exercise) => {
        const tempExercises = [...state.exercises];
        tempExercises.splice(tempExercises.indexOf(exercise), 1, { ...exercise, temp: true })
        setState({ ...state, exercises: tempExercises });
        await exercisesService.del(exercise);
        refreshExercises();
    }

    const updateExercise = async (original, edited) => {
        // const tempExercises = [...state.exercises];
        // tempExercises.splice(tempExercises.indexOf(original), 1, { ...edited, temp: true })
        // setState({ ...state, exercises: tempExercises });
        await exercisesService.update(trainingId, edited);
        refreshExercises();
    }

    const onClick = (id) => {
        props.history.push(`${ROUTES.EXERCISE_DETAILS}/${trainingId}/${id}`);
    }

    const onAdd = async (newElementName) => {
        setState({ ...state, exercises: [...state.exercises, { name: newElementName, temp: true }] });
        const lastIndex = state.exercises.length == 0 ? 0 : Math.max(...state.exercises.map(x => x.order || 0)) + 1;
        const newExercise = {
            name: newElementName,
            description: '',
            order: lastIndex,
        }
        await exercisesService.add(state.currentTraining.id, newExercise);
        refreshExercises();
    }

    const onNameChange = async (currentTraining, newName) => {
        console.log(newName);
        await trainingService.update({ ...currentTraining, name: newName });
        refreshTrainingName();
    }

    const exerciseDoneToday = (exercise) => {
        const lastUpdate = DatetimeHelper.getUtcDateWithoutTime(new Date(exercise.lastUpdateDate)).getTime();
        const today = DatetimeHelper.getUtcDateWithoutTime(new Date()).getTime();
        return lastUpdate === today;
    }

    const orderedExercises = state.exercises && state.exercises.sort((a, b) => a.order > b.order);
    return (
        <div className="container-fluid">
            <BackBar label="Back to Trainings" linkTarget="/" history={props.history} />
            {!orderedExercises &&
                <p className="text-muted text-center mt-5">
                    Loading...
                </p>
            }
            {state.currentTraining &&
                <EditableTitle title={state.currentTraining.name} onChange={(newName) => onNameChange(state.currentTraining, newName)} />
            }
            <br />
            
            {(orderedExercises && orderedExercises.length == 0) &&
                <p className="text-muted text-center mt-5">
                    Add here the exercises of your training
                </p>
            }
            {orderedExercises &&
                <CrudList
                    items={orderedExercises}
                    onItemSelect={onClick}
                    onItemDelete={deleteExercise}
                    onItemAdd={onAdd}
                    semaforeCondition={exerciseDoneToday}
                    onItemEdit={updateExercise} />
            }
        </div>
    );
};

export default TrainingDetailsPage;