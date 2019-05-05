import React, { useContext, useState, useEffect } from 'react';
import { UserSelectionsServiceContext } from '../../services/user-selection-service';
import { ExercisesServiceContext } from '../../services/exercises-service';
import * as ROUTES from '../../constants/routes';
import { TrainingsServiceContext } from '../../services/trainings-service';
import ListControls from '../common/list-controls';
import EditableTitle from '../common/editable-title';
import DeleteButton from '../common/delete-button';
import * as DatetimeHelper from '../../utils/datetime-helper';

const INITIAL_STATE = {
    currentTraining: [],
}

const TrainingDetailsPage = (props) => {
    const [state, setState] = useState({ INITIAL_STATE });

    const userSelectionsService = useContext(UserSelectionsServiceContext);
    const exercisesService = useContext(ExercisesServiceContext);
    const trainingService = useContext(TrainingsServiceContext);
    const exercises = exercisesService && exercisesService.exercises;

    useEffect(() => {
        if (userSelectionsService.userSelections.trainingId && trainingService.trainings) {
            let currentTraining = trainingService.trainings.find(x => x.id === userSelectionsService.userSelections.trainingId);
            setState({ ...state, currentTraining: currentTraining });
        }
    }, [trainingService])

    const deleteExercise = (id) => {
        exercisesService.del(state.currentTraining.id, id);
    }

    const onClick = (id) => {
        console.log("should slect exercise id: " + id);
        userSelectionsService.setSelectedExercise(id);
        props.history.push(ROUTES.EXERCISE_DETAILS);
    }

    const onAdd = (newElementName) => {
        console.log("should add " + newElementName);
        const newExercise = {
            name: newElementName,
            description: ''
        }
        exercisesService.add(state.currentTraining.id, newExercise);
    }

    const onNameChange = (currentTraining, newName) => {
        console.log(newName);
        trainingService.update({ ...currentTraining, name: newName });
    }

    return (
        <>
            {/* <p>
                Training details for training: {userSelectionsService.userSelections.trainingId}
                </p> */}

            {state.currentTraining &&
                <EditableTitle title={state.currentTraining.name} onChange={(newName) => onNameChange(state.currentTraining, newName)} />
            }
            <br />
            {(!exercises || exercises.length == 0) &&
                <div className="text-muted text-center m-5">Add here the exercises of your training</div>
            }
            {exercises &&
                <div className="col-12">
                    <div className="list-group">
                        <List exercises={exercises} onClick={onClick} deleteExercise={deleteExercise} />
                        <ListControls onAdd={onAdd}>
                            <ListElementEditor />
                        </ListControls>
                    </div>
                </div>
            }
        </>
    );
};

const ListElementEditor = (props) => {
    const onChange = (event) => {
        props.onChange(event.target.value);
    }

    const onKeyPressed = (e) => {
        if (e.key === 'Enter') {
            props.onSubmit();
        }
    }

    return (
        <input
            name="newElementName"
            type="text"
            className="form-control"
            placeholder="New Exercise"
            value={props.value}
            onChange={onChange}
            onKeyPress={onKeyPressed} />
    )
}



const List = ({ exercises, onClick, deleteExercise }) => {

    const isDoneToday = (lastUpdateDate) => {
        const lastUpdate = DatetimeHelper.getUtcDateWithoutTime(new Date(lastUpdateDate)).getTime();
        const today = DatetimeHelper.getUtcDateWithoutTime(new Date()).getTime();
        return lastUpdate === today;
    }

    return (
        exercises.map(exercise =>
            <button
                key={exercise.id}
                className="list-group-item d-flex justify-content-between"
                onClick={(event) => { event.preventDefault(); onClick(exercise.id) }}>
                <div>
                    <div>
                        {exercise.name} {isDoneToday(exercise.lastUpdateDate) ? ' (done)' : ''}
                    </div>
                    <div className="text-muted">
                        {exercise.description}
                    </div>
                </div>
                {isDoneToday(exercise.lastUpdateDate) &&
                    <div class="led-green">
                    </div>
                }
                <div className="mx-2">
                    <DeleteButton onClick={() => deleteExercise(exercise.id)} />
                </div>
            </button>
        )
    )
}

export default TrainingDetailsPage;